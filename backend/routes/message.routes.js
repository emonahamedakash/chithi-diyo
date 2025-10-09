const express = require("express");
const router = express.Router();
const {
    getInbox,
    getMessageDetails,
    setMarkAsRead
} = require("../controllers/message.controller");
module.exports = (app) => {
    router.get("/inbox/fetch-message-list/:id", getInbox);
    router.get("/inbox/fetch-message-details/:message_id", getMessageDetails);
    router.patch("/inbox/mark-as-read/:message_id", setMarkAsRead);
    return app.use("/api", router);
};