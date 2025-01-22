const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Routes for CRUD operations
router.get("/", getUsers); // Get all users
router.get("/:id", getUserById); // Get user by ID
router.post("/", createUser); // Create a new user
router.put("/:id", updateUser); // Update user
router.delete("/:id", deleteUser); // Delete user

module.exports = router;
