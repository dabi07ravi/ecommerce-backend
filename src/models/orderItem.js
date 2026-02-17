"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {

    static associate(models) {

      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      priceSnapshot: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
      timestamps: true,
    }
  );

  return OrderItem;
};
