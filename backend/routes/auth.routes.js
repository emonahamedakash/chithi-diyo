const {
  register,
  login,
  checkLoginState,
  forgotPassword,
  facebookLogin,
} = require("../controllers/auth.controller");
const router = require("express").Router();

module.exports = (app) => {
  router.post("/user/login", login);
  router.post("/user/register", register);
  router.get("/user/check-login-state", checkLoginState);
  router.post("/user/forgot-password", forgotPassword);
  router.post("/user/facebook-login", facebookLogin);

  return app.use("/api", router);
};
