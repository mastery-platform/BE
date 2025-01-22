const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (authentication)
const protect = async (req, res, next) => {
  let token;

  // Check if the request has an authorization header with a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the authenticated user to the request (excluding the password)
      req.user = await User.findById(decoded.id).select("-password");

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
  if (req.user && req.user.role === "admin") {
    next(); // Continue to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
