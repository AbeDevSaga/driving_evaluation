"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSection extends Model {
    static associate(models) {
      ExamSection.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
      });

      ExamSection.hasMany(models.ExaminerAssignment, {
        foreignKey: "section_id",
        as: "examiners",
      });

      ExamSection.hasMany(models.SectionResult, {
        foreignKey: "section_id",
        as: "results",
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
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      weight_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false, // total must be 100 per exam
      },
      max_score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 100,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ExamSection",
      tableName: "exam_sections",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamSection;
};
