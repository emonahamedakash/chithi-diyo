const { getProfileDetails } = require("../controllers/profile.controller");
const router = require("express").Router();
module.exports = (app) => {
    router.get("/profile/fetch-details", getProfileDetails);
    return app.use("/api", router);
};
