const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask); // ✅ Create task
router.get("/", protect, getTasks); // ✅ Get all tasks for logged-in user
router.put("/:id", protect, updateTask); // ✅ Update task
router.delete("/:id", protect, deleteTask); // ✅ Delete task

module.exports = router;
