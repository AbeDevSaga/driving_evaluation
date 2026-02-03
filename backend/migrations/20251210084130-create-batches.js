"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("batches", {
      batch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      vehicle_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "vehicle_categories",
          key: "vehicle_category_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      batch_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("batches");
  },
};
