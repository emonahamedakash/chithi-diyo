const { chithi } = require("../../config/db");

const { customAlphabet } = require('nanoid');

const generateLinkId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);

const createLink = async (req, res) => {
  try {
    const { user_id, title, created_at } = req.body;

    // Validate required fields
    if (!user_id || !title || !created_at) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get all existing links
    const existingLinks = await chithi('message_links')
      .select('link');

    const existingLinkSet = new Set(existingLinks.map(link => link.link));

    // Generate unique link - infinite loop until unique found
    let generatedLink;
    let attempts = 0;

    while (true) {
      const randomPath = generateLinkId();
      generatedLink = `${process.env.CHITHI_DIYO_FRONTEND_URL}/sent-message/${randomPath}`;
      attempts++;

      if (!existingLinkSet.has(generatedLink)) {
        break;
      }
    }

    console.log(`Generated unique link after ${attempts} attempts`);

    // Insert the link (if duplicate occurs here, it's extremely rare with nanoid)
    const [linkId] = await chithi('message_links')
      .insert({
        user_id: user_id,
        title: title.trim(),
        link: generatedLink,
        status: 1,
        created_at: created_at,
      });

    res.status(201).json({
      success: true,
      data: {
        id: linkId,
        link: generatedLink,
        title: title.trim()
      },
      message: "Link created successfully"
    });

  } catch (err) {
    console.error("Error creating link:", err);

    // If duplicate occurs during insert (extremely rare), recursively retry
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
      console.log('Extremely rare duplicate occurred, retrying...');
      return createLink(req, res);
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const fetchLinkList = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      })
    }

    const checkUser = await chithi("users")
      .where("id", user_id)
      .andWhere("status", 1)
      .first();

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "user not found on inactive user"
      })
    }

    const linkList = await chithi("message_links")
      .select("*")
      .where("user_id", user_id)
      .andWhere("status", 1);

    if (linkList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active link found. Create now..."
      })
    }

    return res.status(200).json({
      success: true,
      list: linkList
    })

  } catch (error) {
    console.log(error);
  }
}

const deleteLink = async (req, res) => {
  try {
    const { link_id } = req.params;

    if (!link_id) {
      return res.status(400).json({
        success: false,
        message: "Link id required"
      })
    }

    const checkLink = await chithi("message_links")
      .select("*")
      .where("id", link_id)
      .andWhere("status", 1) // Changed from "is_deleted" to "status" based on your schema
      .first();

    if (!checkLink) {
      return res.status(404).json({
        success: false,
        message: "No link found in database..."
      })
    }

    // Start a transaction to ensure data consistency
    await chithi.transaction(async (trx) => {
      // Delete all messages associated with this link
      await trx("messages")
        .where("message_link_id", link_id)
        .del();

      // Delete the link itself
      await trx("message_links")
        .where("id", link_id)
        .del();
    });

    return res.status(200).json({
      success: true,
      message: "Link and associated messages deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting link:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

module.exports = { createLink, fetchLinkList, deleteLink };
