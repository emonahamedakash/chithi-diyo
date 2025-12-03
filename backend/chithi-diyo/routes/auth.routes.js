const {
  register,
  login,
  checkLoginState,
  forgotPassword,
} = require("../controllers/auth.controllers");
const router = require("express").Router();

module.exports = (app, basePath = "") => {
  router.post("/login", login);
  router.post("/register", register);
  router.get("/check-login-state", checkLoginState);
  router.post("/forgot-password", forgotPassword);

  return app.use(basePath, router);
};
