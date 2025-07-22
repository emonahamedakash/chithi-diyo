const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
// const messageRoutes = require("./messageRoutes");
// const adminRoutes = require("./adminRoutes");

// API routes
router.use("/api/auth", authRoutes);
// router.use("/api/messages", messageRoutes);
// router.use("/api/admin", adminRoutes);

// Health check endpoint
router.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// 404 handler for API routes
// router.use("/api/*", (req, res) => {
//   res.status(404).json({ status: "error", message: "Endpoint not found" });
// });

module.exports = router;
