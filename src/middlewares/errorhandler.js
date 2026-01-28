const errorHandler = (err, req, res, next) => {
  // Defaults
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.message == "User already exists") {
    statusCode = 400;
    message = "User already exists";
  }

  if (err.message == "Invalid email credentials") {
    statusCode = 400;
    message = "Invalid email credentials";
  }

  if (err.message == "Invalid password credentials") {
    statusCode = 400;
    message = "Invalid password credentials";
  }

  if (err.message == "Refresh token expired") {
    statusCode = 401;
    message = "Refresh token expired";
  }

  if (err.message == "Invalid refresh token") {
    statusCode = 400;
    message = "Invalid refresh token";
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // Sequelize unique constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
