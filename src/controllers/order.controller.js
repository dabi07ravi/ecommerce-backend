const orderService = require("../services/order.service");

const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.placeOrder(req.user.id);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
};
