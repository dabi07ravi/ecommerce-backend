"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("PaymentLogs", {

      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      eventType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      payload: {
        type: Sequelize.JSON,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "RECEIVED",
          "PROCESSED",
          "FAILED"
        ),
        allowNull: false,
        defaultValue: "RECEIVED",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }

    });

    // Recommended indexes for faster queries
    await queryInterface.addIndex("PaymentLogs", ["eventType"]);
    await queryInterface.addIndex("PaymentLogs", ["createdAt"]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PaymentLogs");
  },
};
