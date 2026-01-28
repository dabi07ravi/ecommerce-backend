const AppError = require('../utils/appError')


const { Product } = require("../models");

getAll = async () => {
  return Product.findAll();
};

getById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

create = async (data) => {
  return Product.create(data);
};

update = async (productId, data, user) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Ownership check
  if (user.role !== "ADMIN" && product.createdBy !== user.id) {
    throw new AppError("Forbidden", 403);
  }

  return product.update(data);
};

remove = async (productId, user) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (user.role !== "ADMIN" && product.createdBy !== user.id) {
    throw new AppError("Forbidden", 403);
  }

  await product.destroy();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
