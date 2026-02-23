"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

await queryInterface.createTable("Refunds", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },

  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  reason: Sequelize.STRING,

  status: {
    type: Sequelize.ENUM(
      "INITIATED",
      "PROCESSING",
      "REFUNDED",
      "FAILED"
    ),
    defaultValue: "INITIATED",
  },

  razorpayRefundId: Sequelize.STRING,

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },

  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Refunds");
  },
};
