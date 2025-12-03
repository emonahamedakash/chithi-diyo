const { fetchDashboardData } = require("../controllers/dashboard.controllers");
const router = require("express").Router();
module.exports = (app, basePath = "") => {
  router.get("/fetch-dashboard-data", fetchDashboardData);
  return app.use(basePath, router);
};
