const crypto = require("crypto");
const paymentService = require("../services/payment.service");
const { PaymentLog, Refund, Order } = require("../../models");

exports.handleWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).send("Invalid webhook signature");
  }

  const event = req.body.event;
  const payload = req.body.payload;

  // Log everything
  await PaymentLog.create({
    eventType: event,
    payload: JSON.stringify(req.body),
    status: "RECEIVED",
  });

  if (event === "payment.failed") {
    const payment = payload.payment.entity;
    await paymentService.markPaymentFailed({
      razorpayOrderId: payment.order_id,
      paymentId: payment.id,
      signature: "webhook",
    });
  }

  if (event === "payment.captured") {
    const payment = payload.payment.entity;

    await paymentService.markPaymentSuccess({
      razorpayOrderId: payment.order_id,
      paymentId: payment.id,
      signature: "webhook",
    });
  }

  if (event === "refund.processed") {
    const refundId = payload.refund.entity.id;

    const refund = await Refund.findOne({
      where: { razorpayRefundId: refundId },
    });

    if (refund) {
      refund.status = "REFUNDED";
      await refund.save();

      await paymentService.markPaymentRefunded({
          id: refund.order_id,
          status : refund.status,
      });
    }
  }

  res.json({ status: "ok" });
};
