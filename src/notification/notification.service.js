const notificationQueue = require("../notification/notification.queues");

async function sendNotification(data) {
  await notificationQueue.add("send-notification", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
  });
}

module.exports = { sendNotification };
