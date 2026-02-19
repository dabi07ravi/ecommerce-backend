"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {

      // Payment belongs to User
      Payment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Payment belongs to Order
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

    }
  }

  Payment.init(
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

      razorpayOrderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "INR",
      },

      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "SUCCESS",
          "FAILED"
        ),
        defaultValue: "PENDING",
      },

      method: {
        type: DataTypes.STRING, // card, upi, netbanking, wallet etc
        allowNull: true,
      },

      signature: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    }
  );

  return Payment;
};
