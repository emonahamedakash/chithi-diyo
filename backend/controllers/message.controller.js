const jwt = require("jsonwebtoken");
const db = require("../config/db");

const getInbox = async (req, res) => {
    try {
        const { id } = req.params;

        const messageList = await db("messages")
            .leftJoin("message_links", "message_links.id", "messages.link_id")
            .select("messages.*", "message_links.title", "message_links.created_at as link_created_at")
            .where("messages.user_id", parseInt(id));

        if (!messageList) {
            return res.status(404).json({
                flag: "FAIL",
                message: "No message found"
            });
        }
        return res.status(200).json({
            flag: "SUCCESS",
            message: "Message List Fetch Successful",
            list: messageList
        })
    } catch (err) {
        console.log(err);
    }
}
const getMessageDetails = async (req, res) => {
    try {
        const { message_id } = req.params;

        console.log("req.params:", req.params);

        const messageDetails = await db("messages")
            .select("*")
            .where("id", parseInt(message_id))
            .first();

        if (!messageDetails) {
            return res.status(404).json({
                flag: "FAIL",
                message: "No details found"
            });
        }
        return res.status(200).json({
            flag: "SUCCESS",
            message: "Message Details Fetch Successful",
            details: messageDetails
        })
    } catch (err) {
        console.log(err);
    }
}
const setMarkAsRead = async (req, res) => {
    try {
        const { message_id } = req.params;

        // Validate message_id
        if (!message_id || isNaN(parseInt(message_id))) {
            return res.status(400).json({
                flag: "FAIL",
                message: "Invalid message ID"
            });
        }

        const updated = await db("messages")
            .where("id", parseInt(message_id))
            .update({ is_read: 1 });

        console.log(updated);

        if (updated === 0) {
            return res.status(404).json({
                flag: "FAIL",
                message: "Message not found"
            });
        }

        res.status(200).json({
            flag: "SUCCESS",
            message: "Read status updated successfully"
        });

    } catch (error) {
        console.error("Error updating read status:", error);
        res.status(500).json({
            flag: "FAIL",
            message: "Internal server error"
        });
    }
};

module.exports = { getInbox, getMessageDetails, setMarkAsRead };