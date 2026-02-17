const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

router.post(
  "/place",
  authenticate,
  authorize("CUSTOMER"),
  orderController.placeOrder,
);

router.get(
  "/get",
  authenticate,
  authorize("CUSTOMER"),
  orderController.getMyOrders,
);

router.get(
  "/order/:id",
  authenticate,
  authorize("CUSTOMER"),
  orderController.getOrderById,
);
