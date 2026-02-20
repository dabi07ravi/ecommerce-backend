const { Order } = require("../models");

const { allowedTransitions } = require("../constants");

const updateOrderStatus = async (orderId, newStatus, user) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error("Order not found");

  // 🔐 Authorization
  if (user.role !== "ADMIN") {
    throw new Error("Only admin can update order status");
  }

  const currentStatus = order.status;

  const allowed = allowedTransitions[currentStatus] || [];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Cannot change status from ${currentStatus} to ${newStatus}`,
    );
  }

  order.status = newStatus;
  await order.save();

  return order;
};

module.exports = { updateOrderStatus };
