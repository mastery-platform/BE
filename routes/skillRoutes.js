const express = require("express");
const {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/SkillController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createSkill); // ✅ Create an Skill
router.get("/", protect, getSkills); // ✅ Get all skills
router.put("/:id", protect, updateSkill); // ✅ Update an Skill
router.delete("/:id", protect, deleteSkill); // ✅ Delete an Skill

module.exports = router;
