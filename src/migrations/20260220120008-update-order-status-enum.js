"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.changeColumn("Orders", "status", {
      type: Sequelize.ENUM(
        "CREATED",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
        "RETURN_REQUESTED",
        "RETURNED",
        "REFUNDED"
      ),
      allowNull: false,
      defaultValue: "CREATED",
    });

  },

  async down(queryInterface, Sequelize) {

    // Revert to old ENUM values
    await queryInterface.changeColumn("Orders", "status", {
      type: Sequelize.ENUM(
        "CREATED",
        "PAID",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "CREATED",
    });

  },

};
