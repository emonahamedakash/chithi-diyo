const { chithi } = require("../../config/db");

const fs = require("fs");
const path = require("path");
require("dotenv").config();

const getProfileDetails = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({
        flag: "FAIL",
        message: "User id required",
      });
    }
    const userDetails = await chithi("users")
      .select("id", "email", "facebook", "user_name", "short_bio", "profile_picture")
      .where("id", parseInt(user_id))
      .first();
    if (!userDetails) {
      return res.status(404).json({
        flag: "FAIL",
        message: "No user Found",
      });
    }
    res.status(200).json({
      flag: "SUCCESS",
      message: "User details fetch successfully",
      details: userDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { user_id, current_password, new_password } = req.body;

    if (!user_id || !current_password || !new_password) {
      return res.status(400).json({
        flag: "FAIL",
        message: "User ID, Current Password and New Password required",
      });
    }

    const baseQuery = await chithi("users")
      .select("*")
      .where("id", parseInt(user_id))
      .first();

    if (!baseQuery) {
      return res.status(404).json({
        flag: "FAIL",
        message: "No user found",
      });
    }

    if (baseQuery.password !== current_password) {
      return res.status(400).json({
        flag: "FAIL",
        message: "Current password is not correct",
      });
    }
    const updatingPassword = await chithi("users")
      .update({
        password: new_password,
      })
      .where("id", parseInt(user_id));

    if (!updatingPassword) {
      return res.status(400).json({
        flag: "FAIL",
        message: "Something went wrong in database",
      });
    }

    res.status(204).json({
      flag: "SUCCESS",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user_id, user_name, updated_at, short_bio, profile_picture } = req.body;

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "User ID required"
      })
    }

    const checkUser = await chithi("users")
      .select("*")
      .where("id", parseInt(user_id))
      .first();

    if (!checkUser) {
      res.status(404).json({
        success: false,
        message: "No user found"
      })
    }

    const updatedUser = await chithi("users")
      .update({
        user_name,
        short_bio,
        profile_picture,
        updated_at
      })
      .where("id", parseInt(user_id));

    if (!updatedUser) {
      res.status(401).json({
        success: false,
        message: "Database error..."
      })
    }

    res.status(200).json({
      success: true,
      message: "user data updated"
    })

  } catch (error) {
    console.log(error);
  }
}

//Upload product image
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadProfilePicture = async (req, res) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).send({
      success: false,
      message: "No file uploaded",
    });
  }
  // Validate filename
  if (!req.file.filename) {
    console.error("Missing filename in file:", req.file);
    return res.status(400).send({
      success: false,
      message: "Invalid file format",
    });
  }

  try {
    const source = path.join(process.env.CHITHI_DIYO_UPLOAD_LOCATION + req.file.filename);
    const destination = path.join(process.env.CHITHI_DIYO_CLIENT_LOCATION + "images/profile/" + req.file.filename);

    // Ensure destination directory exists
    ensureDirectoryExists(path.dirname(destination));

    // Copy file to destination
    await fs.promises.copyFile(source, destination);

    // Delete temporary file
    await fs.promises.unlink(source);

    const updatingDatabase = await chithi("users")
      .update({ profile_picture: req.file.filename })
      .where("id", parseInt(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Image Uploaded Successfully",
      file: req.file.filename,
    });

  } catch (error) {
    console.error("File processing error:", error);
    return res.status(500).send({
      success: false,
      message: "Error processing file",
      error: error.message,
    });
  }
};

const removeProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "User ID required"
      })
    }
    const checkUser = await chithi("users")
      .select("*")
      .where("id", parseInt(id))
      .first();

    if (!checkUser) {
      res.status(404).json({
        success: false,
        message: "No user found"
      })
    }

    const updatedUser = await chithi("users")
      .update({
        profile_picture: null
      })
      .where("id", parseInt(id));

    if (!updatedUser) {
      res.status(401).json({
        success: false,
        message: "Database error..."
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile picture removed"
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getProfileDetails, updateProfile, updatePassword, uploadProfilePicture, removeProfilePicture };
