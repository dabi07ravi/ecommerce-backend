const { sequelize } = require("../models/index");

const { Product, Cart, CartItem } = require("../models");

const addToCart = async (userId, productId, quantity) => {
  return sequelize.transaction(async (t) => {
    // 1️⃣ Find or create cart
    let cart = await Cart.findOne({ where: { userId }, transaction: t });

    if (!cart) {
      cart = await Cart.create({ userId }, { transaction: t });
    }

    // 2️⃣ Validate product
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error("Product not found");

    // 3️⃣ Validate stock
    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    // 4️⃣ Check existing cart item
    let item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      transaction: t,
    });

    if (item) {
      item.quantity += quantity;
      await item.save({ transaction: t });
    } else {
      await CartItem.create(
        {
          cartId: cart.id,
          productId,
          quantity,
          priceSnapshot: product.price,
        },
        { transaction: t },
      );
    }

    return cart;
  });
};

const getCart = async (userId) => {
  return Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      },
    ],
  });
};

const updateCartItem = async (userId, itemId, quantity) => {
  return sequelize.transaction(async (t) => {
    const item = await CartItem.findByPk(itemId, { transaction: t }); // ✅ added transaction
    if (!item) throw new Error("Cart item not found");

    // Ownership check
    let cart = await Cart.findOne({ where: { userId }, transaction: t });
    if (!cart || cart.id !== item.cartId) {
      throw new Error("Unauthorized");
    }

    item.quantity = quantity;
    await item.save({ transaction: t });

    return item;
  });
};

const removeCartItem = async (userId, itemId) => {
  return sequelize.transaction(async (t) => {
    const item = await CartItem.findByPk(itemId, { transaction: t }); // ✅ added transaction
    if (!item) throw new Error("Cart item not found");

    let cart = await Cart.findOne({ where: { userId }, transaction: t });
    if (!cart || cart.id !== item.cartId) {
      throw new Error("Unauthorized");
    }

    await item.destroy();

    return { message: "Item removed" };
  });
};

module.exports = { addToCart, getCart, updateCartItem, removeCartItem };
