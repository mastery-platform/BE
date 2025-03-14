const mongoose = require("mongoose");

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  dailyTime: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  studyPlan: [
    {
      date: { type: Date, required: true },
      topic: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("StudyPlan", studyPlanSchema);
