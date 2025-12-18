"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("exam_schedules", {
      schedule_id: {
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

      exam_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("exam_schedules");
  },
};
