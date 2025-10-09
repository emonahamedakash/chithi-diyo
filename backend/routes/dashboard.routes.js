const { fetchDashboardData } = require("../controllers/dashboard.controller");
const router = require("express").Router();
module.exports = (app) => {
    router.get("/fetch-dashboard-data", fetchDashboardData);
    return app.use("/api", router);
};
