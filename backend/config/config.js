require("dotenv").config();

const environment = process.env.NODE_ENV || "development";

const common = {
  env: environment,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  cookieSecure: environment === "production",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  storeIpAddresses: process.env.STORE_IP_ADDRESSES === "true",
  storeUserAgents: process.env.STORE_USER_AGENTS === "true",
};

const development = {
  ...common,
  database: {
    name: process.env.DB_NAME || "anonymous_msg_dev",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
  },
};

const production = {
  ...common,
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
};

const test = {
  ...common,
  database: {
    name: process.env.TEST_DB_NAME || "anonymous_msg_test",
    user: process.env.TEST_DB_USER || "root",
    password: process.env.TEST_DB_PASSWORD || "",
    host: process.env.TEST_DB_HOST || "localhost",
  },
};

const config = {
  development,
  production,
  test,
};

module.exports = config[environment];
