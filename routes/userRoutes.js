const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  loginUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ FIX: Ensure "/me" route is first to prevent conflicts with "/:id"
router.get("/me", protect, getMe);

// Register a new user (public)
router.post("/register", registerUser);

// Login user (public)
router.post("/login", loginUser);

// Get all users (admin only)
router.get("/", protect, admin, getUsers);

// Get a single user by ID (protected)
router.get("/:id", protect, getUserById);

// Update user details (protected)
router.put("/:id", protect, updateUser);

// Delete a user (admin only)
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
