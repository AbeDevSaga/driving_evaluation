"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("examiner_assignments", {
      assignment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
    });

    // ✅ Prevent duplicate examiner–section assignments
    await queryInterface.addConstraint("examiner_assignments", {
      fields: ["examiner_id", "section_id"],
      type: "unique",
      name: "unique_examiner_section_assignment",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "examiner_assignments",
      "unique_examiner_section_assignment"
    );

    await queryInterface.dropTable("examiner_assignments");
  },
};
