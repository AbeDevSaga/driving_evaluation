"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSection extends Model {
    static associate(models) {
      ExamSection.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
      });

      ExamSection.hasMany(models.ExamSectionEvaluation, {
        foreignKey: "section_id",
        as: "evaluations",
      });

      // NEW: Section -> Many Examiners (assign examiners)
      ExamSection.belongsToMany(models.User, {
        through: models.ExamSectionExaminer,
        foreignKey: "section_id",
        otherKey: "examiner_id",
        as: "assignedExaminers",
      });
    }
  }

  ExamSection.init(
    {
      section_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      exam_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 100 },
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ExamSection",
      tableName: "exam_sections",
      timestamps: false,
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return ExamSection;
};
