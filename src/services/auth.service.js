const { User, RefreshToken } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt");
const bcrypt = require("bcrypt");

const registerUser = async ({ name, email, password }) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Create user
  const user = await User.create({
    name,
    email,
    password, // password will be hashed by model hook
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password credentials");

  const payload = { id: user.id, email: user.email, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

const refreshToken = async (oldToken) => {
  const storedToken = await RefreshToken.findOne({
    where: { token: oldToken, isRevoked: false },
  });
  if (!storedToken) throw new Error("Invalid refresh token");

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const payload = verifyToken(oldToken, process.env.JWT_REFRESH_SECRET);

  // rotate token
  await storedToken.destroy();

  const newAccessToken = generateAccessToken({
    id: payload.id,
    email: payload.email,
  });

  const newRefreshToken = generateRefreshToken({
    id: payload.id,
    email: payload.email,
  });

  await RefreshToken.create({
    token: newRefreshToken,
    userId: payload.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (refreshToken) => {
  const tokenEntry = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (tokenEntry) {
    tokenEntry.isRevoked = true;
    await tokenEntry.save();
  }
};


module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
