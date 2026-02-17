'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 await queryInterface.createTable("OrderItems", {
  id: { primaryKey: true, autoIncrement: true, type: Sequelize.INTEGER },

  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "Orders", key: "id" },
    onDelete: "CASCADE"
  },

  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "Products", key: "id" }
  },

  quantity: { type: Sequelize.INTEGER, allowNull: false },

  priceSnapshot: { type: Sequelize.DECIMAL(10,2), allowNull: false },

  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

  },

  async down (queryInterface, Sequelize) {
       await queryInterface.dropTable("OrderItems");

  }
};
