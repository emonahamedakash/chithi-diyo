const { getProfileDetails } = require("../controllers/profile.controllers");
const router = require("express").Router();
module.exports = (app, basePath) => {
  router.get("/fetch-details", getProfileDetails);
  return app.use(basePath, router);
};
