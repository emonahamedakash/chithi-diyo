const cloudinary = require("cloudinary").v2;
const logger = require("../utils/logger");

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  logger.info("Cloudinary configured successfully");
}

module.exports = cloudinary;
