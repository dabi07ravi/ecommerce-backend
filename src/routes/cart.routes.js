const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Protected
router.post(
  "/add",
  authenticate,
  authorize("CUSTOMER"),
  cartController.addCart,
);

router.get(
  "/get",
  authenticate,
  authorize("CUSTOMER"),
  cartController.getCart,
);

router.patch(
  "/item/:id",
  authenticate,
  authorize("CUSTOMER"),
  cartController.updateItem,
);

router.patch(
  "/item/:id",
  authenticate,
  authorize("CUSTOMER"),
  cartController.removeItem,
);



module.exports = router;
