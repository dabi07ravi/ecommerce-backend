'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // name NOT NULL
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // email NOT NULL + UNIQUE
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    // password NOT NULL
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // role STRING -> ENUM
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('ADMIN', 'CUSTOMER'),
      allowNull: false,
      defaultValue: 'CUSTOMER'
    });
  },

  async down(queryInterface, Sequelize) {

    // revert name
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // revert email
    await queryInterface.changeColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });

    // revert password
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // revert role ENUM -> STRING
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING
    });
  }
};
