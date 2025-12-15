"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SectionResult extends Model {
    static associate(models) {
      SectionResult.belongsTo(models.ExamineeExam, {
        foreignKey: "examinee_exam_id",
        as: "examineeExam",
      });

      SectionResult.belongsTo(models.ExamSection, {
        foreignKey: "section_id",
        as: "section",
      });

      SectionResult.belongsTo(models.User, {
        foreignKey: "examiner_id",
        as: "examiner",
      });
    }
  }

  SectionResult.init(
    {
      section_result_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      examinee_exam_id: {
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
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SectionResult",
      tableName: "section_results",
      timestamps: false,
      underscored: true,
    }
  );

  return SectionResult;
};
