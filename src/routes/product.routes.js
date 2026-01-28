const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Public
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  productController.createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  productController.deleteProduct,
);

module.exports = router;
