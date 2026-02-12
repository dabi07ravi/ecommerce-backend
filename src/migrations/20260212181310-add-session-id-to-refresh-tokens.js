'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RefreshTokens', 'sessionId', {
      type: Sequelize.UUID,
      allowNull: false,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('RefreshTokens', 'sessionId');
  }
};
