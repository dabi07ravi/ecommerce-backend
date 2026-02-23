const refundService = require("../services/refund.service");

const initiateRefund = async (req, res, next) => {
  try {
    const refund = await refundService.initiateRefund(
      req.params.orderId,
      req.body.reason,
    );

    res.json(refund);
  } catch (err) {
    next(err);
  }
};

module.exports = { initiateRefund };
