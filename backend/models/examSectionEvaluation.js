"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSectionEvaluation extends Model {
    static associate(models) {
      ExamSectionEvaluation.belongsTo(models.ExamSection, {
        foreignKey: "section_id",
        as: "section",
      });

      ExamSectionEvaluation.belongsTo(models.User, {
        foreignKey: "examiner_id",
        as: "examiner",
      });

      ExamSectionEvaluation.belongsTo(models.User, {
        foreignKey: "examinee_id",
        as: "examinee",
      });

      ExamSectionEvaluation.belongsTo(models.ExamSchedule, {
        foreignKey: "schedule_id",
        as: "schedule",
      });
    }
  }

  ExamSectionEvaluation.init(
    {
      evaluation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      schedule_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      section_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      examiner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      examinee_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      raw_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 10 },
      },

      calculated_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ExamSectionEvaluation",
      tableName: "exam_section_evaluations",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamSectionEvaluation;
};
