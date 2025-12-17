"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "external_user_type_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "external_user_types",
        key: "external_user_type_id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "external_user_type_id");
  },
};
