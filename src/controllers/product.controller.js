const productService = require("../services/product.service");

getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

getProductById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

createProduct = async (req, res, next) => {
  try {
    const product = await productService.create({
      ...req.body,
      createdBy: req.user.id, // ownership
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(
      req.params.id,
      req.body,
      req.user
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
};

deleteProduct = async (req, res, next) => {
  try {
    await productService.remove(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


module.exports = {

    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct

}
