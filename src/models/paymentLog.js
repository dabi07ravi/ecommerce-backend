"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PaymentLog extends Model {
    static associate(models) {
      // Optional: If you want to relate logs to Payment later
      // PaymentLog.belongsTo(models.Payment, {
      //   foreignKey: "paymentId",
      //   as: "payment",
      // });
    }
  }

  PaymentLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      payload: {
        // Store full webhook payload or request body
        type: DataTypes.JSON,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "RECEIVED",
          "PROCESSED",
          "FAILED"
        ),
        allowNull: false,
        defaultValue: "RECEIVED",
      },

      // createdAt will be auto-handled
      // No updatedAt because logs should not change
    },
    {
      sequelize,
      modelName: "PaymentLog",
      tableName: "PaymentLogs",
      timestamps: true,
      updatedAt: false, // important: logs should be immutable
    }
  );

  return PaymentLog;
};
