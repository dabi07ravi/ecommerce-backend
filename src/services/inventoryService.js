const { Product, InventoryReservation, sequelize } = require("../models");

const reserveStock = async (orderId, items) => {
  return sequelize.transaction(async (t) => {
    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
        lock: true,
      });

      const available = product.stock - product.reservedStock;

      if (available < item.quantity) {
        throw new Error("Insufficient stock");
      }

      // reserve stock
      product.reservedStock += item.quantity;
      await product.save({ transaction: t });

      await InventoryReservation.create(
        {
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        { transaction: t },
      );
    }
  });
};

const confirmReservation = async (orderId, transaction) => {
  const reservations = await InventoryReservation.findAll({
    where: {
      orderId,
      status: "RESERVED",
    },
    transaction,
    lock: true,
  });

  for (const r of reservations) {
    const product = await Product.findByPk(r.productId, {
      transaction,
      lock: true,
    });

    // Move reserved → sold
    product.reservedStock -= r.quantity;
    product.stock -= r.quantity;

    await product.save({ transaction });

    r.status = "CONFIRMED";
    await r.save({ transaction });
  }
};

const releaseReservation = async (orderId, transaction) => {
  const reservations = await InventoryReservation.findAll({
    where: {
      orderId,
      status: "RESERVED",
    },
    transaction,
    lock: true,
  });

  for (const r of reservations) {
    const product = await Product.findByPk(r.productId, {
      transaction,
      lock: true,
    });

    product.reservedStock -= r.quantity;

    await product.save({ transaction });

    r.status = "EXPIRED";
    await r.save({ transaction });
  }
};

module.exports = { reserveStock, confirmReservation, releaseReservation };
