export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const minLength = PASSWORD_REQUIREMENTS.MIN_LENGTH;
  const hasNumber = PASSWORD_REQUIREMENTS.REQUIRE_NUMBER
    ? /\d/.test(password)
    : true;
  const hasSpecialChar = PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL_CHAR
    ? /[!@#$%^&*(),.?":{}|<>]/.test(password)
    : true;

  return {
    isValid: password.length >= minLength && hasNumber && hasSpecialChar,
    requirements: {
      minLength,
      hasNumber,
      hasSpecialChar,
    },
  };
};

export const validateMessageContent = (content) => {
  return (
    content.length >= MESSAGE_LIMITS.MIN && content.length <= MESSAGE_LIMITS.MAX
  );
};

export const validateUsername = (username) => {
  const minLength = 3;
  const maxLength = 30;
  const validChars = /^[a-zA-Z0-9_]+$/;

  return (
    username.length >= minLength &&
    username.length <= maxLength &&
    validChars.test(username)
  );
};

export const validateMessageLinkTitle = (title) => {
  return title.length <= 100;
};
