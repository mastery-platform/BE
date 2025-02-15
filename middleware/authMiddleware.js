const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (authentication)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the authenticated user (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("User not found for the provided token");
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Continue to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict access to admin users only
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user missing" });
  }

  if (req.user.role !== "admin") {
    console.error(`Access denied for user ${req.user.email}, not an admin.`);
    return res.status(403).json({ message: "Not authorized as an admin" });
  }

  next(); // Continue to the next middleware or route handler
};

module.exports = { protect, admin };
