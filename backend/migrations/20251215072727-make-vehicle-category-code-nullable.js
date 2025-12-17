"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("vehicle_categories", "code", {
      type: Sequelize.STRING(20),
      allowNull: true, // ✅ make nullable
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("vehicle_categories", "code", {
      type: Sequelize.STRING(20),
      allowNull: false, // ❌ revert back to NOT NULL
      unique: true,
    });
  },
};
