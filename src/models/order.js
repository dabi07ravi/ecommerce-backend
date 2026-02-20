"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "CREATED",
          "PAID",
          "PROCESSING",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "RETURN_REQUESTED",
          "RETURNED",
          "REFUNDED",
        ),
        defaultValue: "CREATED",
      },

      paymentStatus: {
        type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    },
  );

  return Order;
};
