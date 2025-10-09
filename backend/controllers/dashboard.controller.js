const db = require("../config/db");

const fetchDashboardData = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(404).json({
                flag: "FAIL",
                message: "User id required"
            });
        }
        const linkCount = await db("message_links")
            .where("user_id", user_id)
            .select("*");
        const messageCount = await db("messages")
            .where("user_id", user_id)
            .select("*");

        const recentLinks = await db("message_links")
            .where("user_id", user_id)
            .select("*")
            .limit(5);

        const recentMessages = await db("messages")
            .where("user_id", user_id)
            .select("*")
            .limit(5);

        res.status(200).json({
            flag: "SUCCESS",
            message: "Data fetch successful",
            total_links: linkCount.length,
            total_messages: messageCount.length,
            recent_links: recentLinks,
            recent_messages: recentMessages
        });
    } catch (error) {
        console.log("Error:", error);
    }
}

module.exports = { fetchDashboardData };