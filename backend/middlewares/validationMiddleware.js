const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

// Validate request using express-validator
exports.validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg);
      return next(
        new AppError(`Validation failed: ${errorMessages.join(". ")}`, 400)
      );
    }

    next();
  };
};

// Validate object ID format
exports.validateObjectId = (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError("Invalid ID format", 400));
  }
  next();
};
