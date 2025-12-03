const { createNewMessage } = require("../controllers/public.controllers");
const router = require("express").Router();

module.exports = (app, basePath = "") => {
    router.post("/create-new-message", createNewMessage);
    return app.use(basePath, router);
};
