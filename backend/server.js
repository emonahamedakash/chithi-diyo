const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment-timezone");
require("dotenv").config();
const db = require("./config/db");
const path = require("path");

const app = express();

// Update CORS configuration: specify exact origin instead of *
app.use(
  cors({
    //origin: "http://localhost:5173",
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// Serve the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
moment.tz.setDefault("Asia/Dhaka");

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    time: moment().format(),
    message: "Server is healthy",
  });
});

// controllerProfile()

require("./routes/auth.routes")(app);
require("./routes/link.routes")(app);
require("./routes/message.routes")(app);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  db.raw("SELECT 1")
    .then(() => {
      console.log("✅ DB Connected");
    })
    .catch((err) => {
      console.log(`❌ DB Not Connected\n${err.message}`);
    });
  console.log(`Server running on port ${PORT}`);
});
