const { createLink } = require("../controllers/link.controller");
const router = require("express").Router();
module.exports = (app) => {
  router.post("/links/create", createLink);
  return app.use("/api", router);
};
