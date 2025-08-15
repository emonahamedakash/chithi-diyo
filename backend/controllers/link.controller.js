const db = require("../config/db");
const { moment } = require("moment");

const createLink = async (req, res) => {
  try {
    const { user_id, title } = req.body;

    console.log("Hit create link endpoint");
    const currentDate = moment();

    // Generate a random 8-character string for the link
    const generateRandomString = (length = 8) => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Function to check if link exists in database
    const linkExists = async (link) => {
      const existingLink = await db("message_links").where({ link }).first();
      return !!existingLink;
    };

    // Generate unique link
    let isUnique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;
    let generatedLink;

    while (!isUnique && attempts < MAX_ATTEMPTS) {
      const randomPath = generateRandomString();
      generatedLink = `http://chithidiyo.me/${randomPath}`;

      const exists = await linkExists(generatedLink);
      if (!exists) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        message: "Could not generate a unique link after several attempts",
      });
    }

    // Insert the new link
    const [link] = await db("message_links")
      .insert({
        user_id,
        title,
        link: generatedLink,
        isActive: 1,
        createdAt: currentDate,
      })
      .returning("*");

    res.status(201).json({
      data: link,
      message: "Link Created Successfully",
      generatedLink: generatedLink,
    });
  } catch (err) {
    console.error("Error creating link:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { createLink };
