const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const checkDatabaseConnection = require("./src/configs/database");
const authRoutes = require("./src/routes/auth.routes");
const authMiddleware = require("./src/middlewares/auth.middleware");
const roleMiddleware = require("./src/middlewares/role.middleware");
const ownerShipMiddleware = require("./src/middlewares/ownershipmiddleware");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(helmet());
app.use(cors());
app.use(express.json());

// test database connection
checkDatabaseConnection();

app.get(
  "/health/:userId",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  ownerShipMiddleware((req) => req.params.userId),
  (req, res) => {
    res.status(200).json({ status: "OK" });
  },
);

// api
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} is not found.`,
  });
});

module.exports = app;
