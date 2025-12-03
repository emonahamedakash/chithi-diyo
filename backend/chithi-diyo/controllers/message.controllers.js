const jwt = require("jsonwebtoken");
const { chithi } = require("../../config/db");

const getInbox = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Verify user exists
    const user = await chithi("users")
      .where("id", parseInt(user_id))
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const messageList = await chithi("messages")
      .leftJoin("message_links", "message_links.id", "messages.message_link_id")
      .select(
        "messages.id",
        "messages.message_text",
        "messages.mark_as_read",
        "messages.created_at",
        "message_links.title as link_title",
        "message_links.link",
        "message_links.user_id"
      )
      .where("message_links.user_id", parseInt(user_id))
      .orderBy("messages.created_at", "desc");

    return res.status(200).json({
      success: true,
      message: "Message list fetched successfully",
      list: messageList

    });
  } catch (err) {
    console.error("Error in getInbox:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

const getMessageDetails = async (req, res) => {
  try {
    const { message_id } = req.query;

    if (!message_id || isNaN(parseInt(message_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid message ID is required",
      });
    }

    const messageDetails = await chithi("messages")
      .leftJoin("message_links", "message_links.id", "messages.message_link_id")
      .select(
        "messages.id",
        "messages.message_link_id",
        "messages.message_text",
        "messages.mark_as_read",
        "messages.created_at",
        "messages.click_count",
        "message_links.title as link_title",
        "message_links.link",
        "message_links.user_id",
        "message_links.created_at as link_created_at"
      )
      .where("messages.id", parseInt(message_id))
      .first();

    if (!messageDetails) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message details fetched successfully",
      data: messageDetails
    });
  } catch (err) {
    console.error("Error in getMessageDetails:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

const setMarkAsRead = async (req, res) => {
  try {
    const { message_id } = req.params;

    if (!message_id || isNaN(parseInt(message_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid message ID is required",
      });
    }

    // First, verify the message exists and get its link info
    const message = await chithi("messages")
      .leftJoin("message_links", "message_links.id", "messages.message_link_id")
      .select("messages.id", "message_links.user_id")
      .where("messages.id", parseInt(message_id))
      .first();

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const updated = await chithi("messages")
      .where("id", parseInt(message_id))
      .update({
        mark_as_read: 1,
      });

    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found or already read",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read successfully",
    });
  } catch (error) {
    console.error("Error in setMarkAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// New controller: Mark multiple messages as read
const setBulkMarkAsRead = async (req, res) => {
  try {
    const { message_ids } = req.body;

    if (!message_ids || !Array.isArray(message_ids) || message_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of message IDs is required",
      });
    }

    // Validate all message IDs
    const validMessageIds = message_ids.filter(id => !isNaN(parseInt(id)));
    if (validMessageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid message IDs provided",
      });
    }

    const updated = await chithi("messages")
      .whereIn("id", validMessageIds)
      .update({
        mark_as_read: 1,
      });

    return res.status(200).json({
      success: true,
      message: `${updated} messages marked as read successfully`,
      data: {
        updated_count: updated
      }
    });
  } catch (error) {
    console.error("Error in setBulkMarkAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// New controller: Delete message (soft delete if needed, or hard delete)
const deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.params;

    if (!message_id || isNaN(parseInt(message_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid message ID is required",
      });
    }

    // For hard delete (since messages table doesn't have is_deleted column)
    const deleted = await chithi("messages")
      .where("id", parseInt(message_id))
      .del();

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// New controller: Get messages by link
const getMessagesByLink = async (req, res) => {
  try {
    const { link_id } = req.params;
    const { user_id } = req.query;

    if (!link_id || isNaN(parseInt(link_id))) {
      return res.status(400).json({
        success: false,
        message: "Valid link ID is required",
      });
    }

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Verify the link belongs to the user
    const link = await chithi("message_links")
      .where({
        id: parseInt(link_id),
        user_id: parseInt(user_id),
        is_active: 1,
        is_deleted: 0
      })
      .first();

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found or access denied",
      });
    }

    const messages = await chithi("messages")
      .select(
        "id",
        "message_text",
        "mark_as_read",
        "created_at",
        "click_count"
      )
      .where("message_link_id", parseInt(link_id))
      .orderBy("created_at", "desc");

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: {
        link: {
          id: link.id,
          title: link.title,
          link: link.link
        },
        messages: messages,
        total_messages: messages.length,
        unread_messages: messages.filter(msg => msg.mark_as_read === 0).length
      }
    });
  } catch (err) {
    console.error("Error in getMessagesByLink:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};


module.exports = {
  getInbox,
  getMessageDetails,
  setMarkAsRead,
  setBulkMarkAsRead,
  deleteMessage,
  getMessagesByLink
};