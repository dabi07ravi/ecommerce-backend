const router = require("express").Router();
const controller = require("../controllers/refund.controller");
const auth = require("../middlewares/auth.middleware")
const authorize = require("../middlewares/ownershipmiddleware");

router.post(
  "/:orderId",
  auth,
  authorize("ADMIN"),
  controller.initiateRefund
);

module.exports = router;
