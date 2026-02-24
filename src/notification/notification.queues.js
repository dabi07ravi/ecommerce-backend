const { Queue } = require("bullmq");
const connection = require("../configs/ioredis");

const notificationQueue = new Queue("notification-queue", {
  connection,
});

module.exports = notificationQueue;
