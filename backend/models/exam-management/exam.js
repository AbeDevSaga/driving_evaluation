"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.hasMany(models.ExamSection, {
        foreignKey: "exam_id",
        as: "sections",
      });

      Exam.hasMany(models.ExamSchedule, {
        foreignKey: "exam_id",
        as: "schedules",
      });

      Exam.hasMany(models.ExamineeExam, {
        foreignKey: "exam_id",
        as: "examinees",
      });
    }
  }

  Exam.init(
    {
      exam_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pass_percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 70, // configurable
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "Exam",
      tableName: "exams",
      timestamps: false,
      underscored: true,
    }
  );

  return Exam;
};
