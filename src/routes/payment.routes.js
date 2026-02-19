const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const webhook = require("./payment.webhook");


router.post(
  "/create-order",
  authenticate,
  authorize("CUSTOMER"),
  paymentController.createOrder,
);
router.post(
  "/verify",
  authenticate,
  authorize("CUSTOMER"),
  paymentController.verifyPayment,
);

router.post("/webhook", webhook.handleWebhook);


module.exports = router;
