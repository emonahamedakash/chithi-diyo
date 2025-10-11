const db = require("../config/db");
const moment = require("moment");

const createLink = async (req, res) => {
  try {
    const { user_id, title } = req.body;

    // Convert moment to string format before using in query
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

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
    const [linkId] = await db("message_links")
      .insert({
        user_id: user_id,
        title: title,
        link: generatedLink,
        is_active: 1,
        created_at: currentDate, // Now this is a string, not a Moment object
      })
      .returning('id'); // Return the inserted ID

    console.log("Inserted link ID:", linkId);

    res.status(201).json({
      data: { id: linkId, link: generatedLink },
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
