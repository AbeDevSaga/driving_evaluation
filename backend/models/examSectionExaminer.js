"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSectionExaminer extends Model {
    static associate(models) {
      ExamSectionExaminer.belongsTo(models.ExamSection, {
        foreignKey: "section_id",
        as: "section",
      });

      ExamSectionExaminer.belongsTo(models.User, {
        foreignKey: "examiner_id",
        as: "examiner",
      });
    }
  }

  ExamSectionExaminer.init(
    {
      section_examiner_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      section_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      examiner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ExamSectionExaminer",
      tableName: "exam_section_examiners",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamSectionExaminer;
};
