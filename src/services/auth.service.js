const { User, RefreshToken } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
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

module.exports = {
  registerUser,
};
