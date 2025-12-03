const { chithi } = require("../../config/db");

const fetchDashboardData = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    // Verify user exists
    const user = await chithi("users")
      .where("id", user_id)
      .andWhere("status", 1)
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found on inactive",
      });
    }

    // Get total links count (only active and not deleted)
    const linkCount = await chithi("message_links")
      .where({
        user_id: user_id,
        status: 1,
      })
      .count("id as count")
      .first();

    // Get total messages count through user's message links
    const messageCount = await chithi("messages")
      .leftJoin("message_links", "messages.message_link_id", "message_links.id")
      .where("message_links.user_id", user_id)
      .count("messages.id as count")
      .first();

    // Get recent links (only active and not deleted)
    const recentLinks = await chithi("message_links")
      .where({
        user_id: user_id,
      })
      .select("*")
      .orderBy("created_at", "desc")
      .limit(5);

    // Get recent messages through user's message links
    const recentMessages = await chithi("messages")
      .leftJoin("message_links", "messages.message_link_id", "message_links.id")
      .where("message_links.user_id", user_id)
      .andWhere("message_links.status", 1)
      .select(
        "messages.id",
        "messages.message_text",
        "messages.mark_as_read",
        "messages.created_at",
        "message_links.title as link_title",
        "message_links.link"
      )
      .orderBy("messages.created_at", "desc")
      .limit(5);

    // Get unread messages count
    const unreadMessagesCount = await chithi("messages")
      .leftJoin("message_links", "messages.message_link_id", "message_links.id")
      .where("message_links.user_id", user_id)
      .andWhere("message_links.status", 1)
      .andWhere("messages.mark_as_read", 0)
      .count("messages.id as count")
      .first();

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        total_links: linkCount.count || 0,
        total_messages: messageCount.count || 0,
        unread_messages: unreadMessagesCount.count || 0,
        recent_links: recentLinks,
        recent_messages: recentMessages,
      },
    });
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { fetchDashboardData };