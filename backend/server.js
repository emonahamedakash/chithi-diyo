const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment-timezone");
require("dotenv").config();
const db = require("./config/db");
const path = require("path");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "https://chithidiyo.dokanmanager.com",
        "http://chithidiyo.dokanmanager.com"
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
moment.tz.setDefault("Asia/Dhaka");

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    time: moment().format(),
    message: "Central Server is healthy",
    availableApps: ["dokan-manager", "chithi-diyo", "al-madani", "luxdon"],
  });
});

//------------------------Mount Chithi Diyo routes-----------------------------//
require("./chithi-diyo/routes/auth.routes")(app, "/api/chithi-diyo/auth");
require("./chithi-diyo/routes/link.routes")(app, "/api/chithi-diyo/link");
require("./chithi-diyo/routes/message.routes")(app, "/api/chithi-diyo/message");
require("./chithi-diyo/routes/dashboard.routes")(app, "/api/chithi-diyo/dashboard");
require("./chithi-diyo/routes/profile.routes")(app, "/api/chithi-diyo/profile");
require("./chithi-diyo/routes/public.routes")(app, "/api/chithi-diyo/public");


// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Central Backend Server Running",
    availableEndpoints: {
      chithiDiyo: "/api/chithi-diyo",
    },
    health: "/health",
  });
});

// 404 handler
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    flag: "FAIL",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Central Server running on port ${PORT}`);
  console.log("   - Chithi Diyo: /api/chithi-diyo");
});
