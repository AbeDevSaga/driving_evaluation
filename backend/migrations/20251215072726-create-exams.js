"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exams", {
      exam_id: {
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

      structure_node_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "structure_nodes",
          key: "structure_node_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pass_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 70,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exams");
  },
};
