const { getProfileDetails, uploadProfilePicture, removeProfilePicture, updateProfile } = require("../controllers/profile.controllers");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_LOCATION || "uploads/chithi-diyo/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

module.exports = (app, basePath) => {
  router.get("/fetch-details", getProfileDetails);
  router.post("/update-profile", updateProfile);
  router.post("/remove-profile-picture/:id", removeProfilePicture);
  router.post("/upload-profile-picture/:id", upload.single("profile_picture"), uploadProfilePicture);
  return app.use(basePath, router);
};
