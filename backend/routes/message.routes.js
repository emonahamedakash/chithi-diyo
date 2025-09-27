const express = require("express");
const router = express.Router();
const {
    getInbox
} = require("../controllers/message.controller");
module.exports = (app) => {
    router.get("/inbox/fetch-message-list/:id", getInbox);
    return app.use("/api", router);
};