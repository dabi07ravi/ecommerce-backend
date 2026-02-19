"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      razorpayOrderId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      razorpayPaymentId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "INR",
      },

      status: {
        type: Sequelize.ENUM("PENDING", "SUCCESS", "FAILED"),
        allowNull: false,
        defaultValue: "PENDING",
      },

      method: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      signature: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      paidAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

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
    await queryInterface.dropTable("Payments");
  },
};
