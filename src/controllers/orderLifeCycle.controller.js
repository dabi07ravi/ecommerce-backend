const lifecycleService = require("../services/orderLifeCycle.service");

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await lifecycleService.updateOrderStatus(
      req.params.id,
      status,
      req.user,
    );

    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateStatus };
