"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamineeExam extends Model {
    static associate(models) {
      ExamineeExam.belongsTo(models.User, {
        foreignKey: "examinee_id",
        as: "examinee",
      });

      ExamineeExam.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
      });

      ExamineeExam.hasMany(models.SectionResult, {
        foreignKey: "examinee_exam_id",
        as: "sectionResults",
      });
    }
  }

  ExamineeExam.init(
    {
      examinee_exam_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      examinee_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exam_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_passed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ExamineeExam",
      tableName: "examinee_exams",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamineeExam;
};
