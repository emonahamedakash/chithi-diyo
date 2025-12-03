const { createLink, fetchLinkList, deleteLink } = require("../controllers/link.controllers");
const router = require("express").Router();
module.exports = (app, basePath = "") => {
  router.post("/create-new-link", createLink);
  router.get("/fetch-link-list", fetchLinkList);
  router.delete("/delete-link/:link_id", deleteLink);
  return app.use(basePath, router);
};
