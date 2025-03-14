const express = require("express");
const {
  checkFeasibility,
  savePlan,
  syncWithGoogleCalendar,
} = require("../controllers/skillPlannerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Route: Analyze skill feasibility (OpenAI)
router.post("/analyze", protect, checkFeasibility);

// ✅ Route: Save user-selected study plan
router.post("/save", protect, savePlan);

// ✅ Route: Sync study plan with Google Calendar
router.post("/sync-calendar", protect, syncWithGoogleCalendar);

module.exports = router;
