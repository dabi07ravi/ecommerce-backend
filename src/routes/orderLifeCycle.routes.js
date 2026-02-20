const express = require("express");
const router = express.Router();

const orderLifeCycleController = require("../controllers/orderLifeCycle.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");




router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  orderLifeCycleController.updateStatus
);

module.exports = router;