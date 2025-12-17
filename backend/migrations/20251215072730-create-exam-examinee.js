"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("examinee_exams", {
      examinee_exam_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      examinee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

      exam_schedule_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "exam_schedules",
          key: "schedule_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      total_score: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      is_passed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("examinee_exams");
  },
};
