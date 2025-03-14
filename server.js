const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const skillRoutes = require("./routes/skillRoutes");
const skillPlannerRoutes = require("./routes/skillPlannerRoutes");

// Middleware & Config
connectDB();
const app = express();

// ✅ CORS Configuration to allow frontend access
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Middleware
app.use(express.json());

// ✅ API Routes (Restored)
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill-planner", skillPlannerRoutes);

// ✅ Error Handling Middleware
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
