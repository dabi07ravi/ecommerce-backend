const AppError = require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  /**
   * ===============================
   * OPERATIONAL ERRORS (KNOWN)
   * ===============================
   */

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(", ");
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(", ");
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

  /**
   * ===============================
   * PROGRAMMING / UNKNOWN ERRORS
   * ===============================
   */
  if (!err.isOperational) {
    console.error("💥 Programming Error:", err);
    statusCode = 500;
    message = "Something went wrong";
  }

  /**
   * ===============================
   * FINAL RESPONSE
   * ===============================
   */
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
