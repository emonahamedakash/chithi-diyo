const jwt = require("jsonwebtoken");
const db = require("../config/db");

const getInbox = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const messageList = await db("messages")
            .select("*")
            .where("user_id", parseInt(id));

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

module.exports = { getInbox };