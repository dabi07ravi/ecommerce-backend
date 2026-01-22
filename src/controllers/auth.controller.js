const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const tokens = await authService.loginUser(req.body);
    res.status(200).json(tokens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logoutUser(req.body.refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports = {
  register,
  login,
  refreshToken,
  logout
};


