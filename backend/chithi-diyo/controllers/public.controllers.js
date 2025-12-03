const { chithi } = require("../../config/db");

const createNewMessage = async (req, res) => {
    try {
        const { message_link, message_text, created_at } = req.body;

        if (!message_link || !message_text || !created_at) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }
        const checkLink = await chithi("message_links")
            .select("*")
            .where("link", message_link)
            .andWhere("status", 1)
            .first();

        if (!checkLink) {
            return res.status(400).json({
                success: false,
                message: "This link does not exist or removed"
            })
        }

        const newMessageInsert = await chithi("messages")
            .insert({
                message_link_id: checkLink.id,
                message_text: message_text,
                created_at: created_at
            });

        if (!newMessageInsert) {
            return res.status(401).json({
                success: false,
                message: "Database error"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Message sent",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong in server"
        })
    }
}

module.exports = {
    createNewMessage
}