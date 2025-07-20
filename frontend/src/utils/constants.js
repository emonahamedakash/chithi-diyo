export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const MESSAGE_LIMITS = {
  MIN: 1,
  MAX: 5000,
};

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REMEMBER_ME: "rememberMe",
};

export const TOAST_DEFAULTS = {
  DURATION: 3000,
  POSITION: "top-right",
};
