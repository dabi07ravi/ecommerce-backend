const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const tokens = await authService.loginUser(req.body);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.body.refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
