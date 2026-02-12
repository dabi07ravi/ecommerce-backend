const { verifyToken } = require("../utils/jwt");
const redis = require("../configs/redis");
const auth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.Authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);

    const sessionExists = await redis.get(`session:${decoded.sessionId}`);
    if (!sessionExists) {
      return res.status(401).json({
        message: "Session expired or logged out",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = auth;
