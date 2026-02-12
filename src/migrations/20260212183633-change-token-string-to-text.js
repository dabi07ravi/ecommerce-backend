'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1️⃣ Remove old column
    await queryInterface.removeColumn('RefreshTokens', 'token');

    // 2️⃣ Add new column with TEXT
    await queryInterface.addColumn('RefreshTokens', 'token', {
      type: Sequelize.TEXT,
      allowNull: false
    });

  },

  async down(queryInterface, Sequelize) {

    // Reverse process

    await queryInterface.removeColumn('RefreshTokens', 'token');

    await queryInterface.addColumn('RefreshTokens', 'token', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

  }
};
