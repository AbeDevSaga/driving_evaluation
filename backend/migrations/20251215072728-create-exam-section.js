"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exam_sections", {
      section_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      exam_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "exams",
          key: "exam_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      weight_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        // total per exam should be validated at app level
      },

      max_score: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 100,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exam_sections");
  },
};
