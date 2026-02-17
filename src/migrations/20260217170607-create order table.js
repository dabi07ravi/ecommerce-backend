"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: { primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },

      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },

      status: {
        type: Sequelize.ENUM(
          "CREATED",
          "PAID",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
        ),
        defaultValue: "CREATED",
      },

      paymentStatus: {
        type: Sequelize.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING",
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.dropTable("Orders");

  },
};
