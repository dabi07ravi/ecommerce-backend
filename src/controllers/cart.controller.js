const cartService = require("../services/cart.service");

const addCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await cartService.updateCartItem(
      req.user.id,
      req.params.id,
      req.body.quantity,
    );
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const result = await cartService.removeCartItem(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCart,
  getCart,
  updateItem,
  removeItem,
};
