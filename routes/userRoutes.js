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

// Protected route to get the authenticated user's details
router.get("/me", protect, getMe);

// Register a new user (public)
router.post("/register", registerUser);

// Get all users (admin only)
router.get("/", protect, admin, getUsers);

// Get a single user by ID (protected)
router.get("/:id", protect, getUserById);

// Update user details (protected)
router.put("/:id", protect, updateUser);

// Delete a user (admin only)
router.delete("/:id", protect, admin, deleteUser);

// POST /api/users/login
router.post("/login", loginUser);

module.exports = router;
