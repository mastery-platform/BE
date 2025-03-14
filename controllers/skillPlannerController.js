const OpenAI = require("openai");
const StudyPlan = require("../models/studyPlan");
const { google } = require("googleapis");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// **Step 1: Check if mastery is feasible**
const checkFeasibility = async (req, res) => {
  try {
    const { skill, dailyTime, deadline } = req.body;
    const today = new Date().toISOString().split("T")[0]; // ✅ Get correct current date

    if (!skill || !dailyTime || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
      Today's date is ${today}.
      A user wants to master "${skill}".
      - They can dedicate **${dailyTime} hours per day**.
      - Their strict deadline is **${deadline}**.
  
      **TASK 1: Feasibility Analysis**
      1. **Calculate the total days available** (from today's date to the deadline).
      2. **Determine the total hours available** (total days * daily hours).
      3. **Compare total available hours with how long it typically takes to master this skill.**
      4. **Determine if the user can master the skill in time**:
         - If **feasible**, return: { "feasible": true }
         - If **not feasible**, return:
           {
             "feasible": false,
             "suggestions": {
               "adjustedDailyTime": recommended_hours_per_day,
               "extendedDeadline": "new_deadline_YYYY-MM-DD"
             }
           }
  
      **STRICT RULES:**
      - **Use the exact provided today's date (${today})**.
      - **Do NOT assume a different current date**.
      - **Only return valid JSON, no explanations.**
      `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.5,
    });

    console.log("Raw OpenAI Response:", response.choices[0].message.content);

    const rawText = response.choices[0].message.content.trim();
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid JSON response from OpenAI");
    }

    const aiResponse = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res
      .status(500)
      .json({ message: "AI analysis failed", error: error.message });
  }
};

// **Step 2: Save Study Plan**
const savePlan = async (req, res) => {
  const { skill, dailyTime, deadline, studyPlan } = req.body;

  try {
    const newPlan = await StudyPlan.create({
      user: req.user._id,
      skill,
      dailyTime,
      deadline,
      studyPlan,
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error("Error saving study plan:", error);
    res.status(500).json({ message: "Failed to save study plan" });
  }
};

// **Step 3: Sync with Google Calendar**
const syncWithGoogleCalendar = async (req, res) => {
  const { studyPlan } = req.body;
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    for (const session of studyPlan) {
      await calendar.events.insert({
        calendarId: "primary",
        resource: {
          summary: `Study: ${session.topic}`,
          start: { dateTime: `${session.date}T09:00:00Z` },
          end: { dateTime: `${session.date}T10:00:00Z` },
        },
      });
    }
    res.status(200).json({ message: "Study plan synced to Google Calendar!" });
  } catch (error) {
    console.error("Google Calendar Error:", error);
    res.status(500).json({ message: "Failed to sync with Google Calendar" });
  }
};

module.exports = { checkFeasibility, savePlan, syncWithGoogleCalendar };
