"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class Refund extends Model {
    static associate(models) {
      Refund.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }

  Refund.init(
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

      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      reason: DataTypes.STRING,

      status: {
        type: DataTypes.ENUM(
          "INITIATED",
          "PROCESSING",
          "REFUNDED",
          "FAILED"
        ),
        defaultValue: "INITIATED",
      },

      razorpayRefundId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Refund",
      tableName: "Refunds",
      timestamps: true,
    }
  );

  return Refund;
};
