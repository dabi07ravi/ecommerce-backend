

const paymentService = require("../services/payment.service");



/**
 * 1️⃣ Create Razorpay Order
 */
const createOrder = async (req, res, next) => {
  try {

    const { orderId, amount } = req.body;

    const razorOrder = await paymentService.createPaymentOrder({
      userId: req.user.id,
      orderId,
      amount,
    });

    res.json(razorOrder);

  } catch (err) {
    next(err);
  }
};



/**
 * 2️⃣ Verify Payment (Frontend Signature Flow)
 */
const verifyPayment = async (req, res, next) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const valid = paymentService.verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!valid) {
      throw new Error("Invalid signature");
    }

    await paymentService.markPaymentSuccess({
      user: req.user,
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    res.json({ success: true });

  } catch (err) {
    next(err);
  }
};



module.exports = {
  createOrder,
  verifyPayment,
};
