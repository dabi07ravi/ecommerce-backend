"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

  class InventoryReservation extends Model {
    static associate(models) {
      InventoryReservation.belongsTo(models.Product);
      InventoryReservation.belongsTo(models.Order);
    }
  }

  InventoryReservation.init({
    productId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,

    quantity: DataTypes.INTEGER,

    expiresAt: DataTypes.DATE,

    status: {
      type: DataTypes.ENUM(
        "RESERVED",
        "CONFIRMED",
        "EXPIRED"
      ),
      defaultValue: "RESERVED",
    },

  }, {
    sequelize,
    modelName: "InventoryReservation",
    tableName: "InventoryReservations",
    timestamps: true,
  });

  return InventoryReservation;
};