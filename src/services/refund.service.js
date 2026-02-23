const Razorpay = require("razorpay");
const { Refund, Order, Payment } = require("../models");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const initiateRefund = async (orderId, reason) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: Payment, as: "payment" }],
  });

  if (!order) throw new Error("Order not found");

  if (order.status !== "RETURNED") {
    throw new Error("Order not eligible for refund");
  }

  const payment = order.payment;

  // 🔥 Call Razorpay Refund API
  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: payment.amount,
  });

  // Save refund locally
  const refundEntry = await Refund.create({
    orderId,
    amount: payment.amount,
    reason,
    razorpayRefundId: refund.id,
    status: "PROCESSING",
  });

  order.status = "REFUND_INITIATED";
  await order.save();

  return refundEntry;
};

module.exports = { initiateRefund };
