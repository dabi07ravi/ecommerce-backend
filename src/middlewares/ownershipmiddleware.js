const ownership = (getResourceUserId) => {
  return async (req, res, next) => {
    /*
      getResourceUserId:
      a function that returns the owner userId
      Example: (req) => req.params.userId
      OR fetch from DB
    */

    const resourceUserId = await getResourceUserId(req);

    // Admin can bypass ownership
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check ownership
    if (String(resourceUserId) !== String(req.user.id)) {
      return res.status(403).json({
        message: 'Forbidden: Not resource owner',
      });
    }

    next();
  };
};

module.exports = ownership;
