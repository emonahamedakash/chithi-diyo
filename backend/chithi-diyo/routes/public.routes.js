const { createNewMessage, fetchUserInfo } = require("../controllers/public.controllers");
const router = require("express").Router();

module.exports = (app, basePath = "") => {
    router.post("/create-new-message", createNewMessage);
    router.get("/fetch-user-info", fetchUserInfo);
    return app.use(basePath, router);
};
