const { Worker } = require("bullmq");
const redis = require("../configs/ioredis");

const { sendEmail } = require("./email.service");
const { sendSMS } = require("./sms.service");

new Worker(
  "notificationQueue",
  async (job) => {
    const { type, email, phone, payload } = job.data;

    switch (type) {
      case "ORDER_CREATED":
        await sendEmail({
          to: email,
          subject: "Order Created",
          html: `<h3>Your order ${payload.orderId} created successfully</h3>`,
        });
        break;

      case "PAYMENT_SUCCESS":
        await sendEmail({
          to: email,
          subject: "Payment Successful",
          html: `<h3>Payment received for order ${payload.orderId}</h3>`,
        });

      case "ORDER_SHIPPED":
        await sendEmail({
          to: email,
          subject: "Order Shipped",
          html: `<h3>Your order shipped 🚚</h3>`,
        });
        break;

      case "REFUND_INITIATED":
        await sendEmail({
          to: email,
          subject: "Refund Initiated",
          html: `<h3>Refund started for order ${payload.orderId}</h3>`,
        });
        break;
    }
  },
  { connection: redis }
);
