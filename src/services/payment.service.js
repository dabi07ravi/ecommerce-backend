const razorpay = require("../configs/razorpay");
const crypto = require("crypto");

const { Payment, Order, sequelize } = require("../models");


/**
 * 1️⃣ Create Razorpay Order
 */
const createPaymentOrder = async ({ userId, orderId, amount }) => {

  const dbOrder = await Order.findByPk(orderId);

  if (!dbOrder) {
    throw new Error("Order not found");
  }

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `order_${orderId}`,
  });

  // Store in DB
  await Payment.create({
    orderId,
    razorpayOrderId: razorpayOrder.id,
    userId,
    amount,
    currency: "INR",
    status: "PENDING",
  });

  return razorpayOrder;
};



/**
 * 2️⃣ Verify Signature (Frontend Flow)
 */
const verifySignature = ({ orderId, paymentId, signature }) => {

  const body = orderId + "|" + paymentId;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expected === signature;
};



/**
 * 3️⃣ Mark Payment Success (Transactional + Idempotent)
 */
const markPaymentSuccess = async ({ razorpayOrderId, paymentId, signature }) => {

  return sequelize.transaction(async (t) => {

    const payment = await Payment.findOne({
      where: { razorpayOrderId },
      transaction: t,
      lock: t.LOCK.UPDATE, // prevent race condition
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Idempotency check
    if (payment.status === "SUCCESS") {
      return payment;
    }

    // Update payment
    payment.status = "SUCCESS";
    payment.razorpayPaymentId = paymentId;
    payment.signature = signature;
    payment.paidAt = new Date();

    await payment.save({ transaction: t });

    // Update order status
    await Order.update(
      { status: "PAID" },
      {
        where: { id: payment.orderId },
        transaction: t,
      }
    );

    return payment;
  });
};



module.exports = {
  createPaymentOrder,
  verifySignature,
  markPaymentSuccess,
};
