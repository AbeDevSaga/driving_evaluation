"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("section_results", {
      section_result_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      examinee_exam_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "examinee_exams",
          key: "examinee_exam_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      section_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "exam_sections",
          key: "section_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      examiner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    // ✅ Prevent duplicate results for same examinee & section
    await queryInterface.addConstraint("section_results", {
      fields: ["examinee_exam_id", "section_id"],
      type: "unique",
      name: "unique_examinee_section_result",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "section_results",
      "unique_examinee_section_result"
    );

    await queryInterface.dropTable("section_results");
  },
};
