const {
  sequelize,
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
} = require("../models");


const inventoryService = require('../services/inventoryService')

const placeOrder = async (userId) => {
  return sequelize.transaction(async (t) => {
    // 1️⃣ Load cart
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: "items" }],
      transaction: t,
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    // 2️⃣ Validate stock + calculate total
    for (const item of cart.items) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
      });

      if (!product) throw new Error("Product missing");

      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      totalAmount += Number(item.priceSnapshot) * item.quantity;

      // // Reduce stock
      // product.stock -= item.quantity;
      // await product.save({ transaction: t });
    }

    // 3️⃣ Create order
    const order = await Order.create(
      {
        userId,
        totalAmount,
      },
      { transaction: t },
    );

    // 4️⃣ Create order items
    for (const item of cart.items) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceSnapshot: item.priceSnapshot,
        },
        { transaction: t },
      );
    }

    // 5️⃣ 🔥 RESERVE INVENTORY
    await inventoryService.reserveStock(order.id, cart.items);

    // 5️⃣ Clear cart
    // await CartItem.destroy({
    //   where: { cartId: cart.id },
    //   transaction: t,
    // });
    // ❌ DO NOT CLEAR CART HERE

    return order;
  });
};

const getMyOrders = async (userId) => {
  return await Order.findAll({
    where: { userId },
    include: [OrderItem],
  });
};

const getOrderById = async (orderId, userId) => {
  return await Order.findOne({
    where: { id: orderId, userId },
    include: [OrderItem],
  });
};

module.exports = { placeOrder, getMyOrders, getOrderById };
