module.exports = (req, res, next) => {
  res.success = (data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.error = (
    message = "Something went wrong",
    statusCode = 500,
    errors = null
  ) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  };

  next();
};
