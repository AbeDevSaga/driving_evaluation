"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSchedule extends Model {
    static associate(models) {
      ExamSchedule.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
      });

      ExamSchedule.hasMany(models.ExamSectionEvaluation, {
        foreignKey: "schedule_id",
        as: "evaluations",
      });

      ExamSchedule.hasMany(models.ExamScheduleExaminee, {
        foreignKey: "schedule_id",
        as: "registeredExaminees",
      });
    }
  }

  ExamSchedule.init(
    {
      schedule_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      exam_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "ExamSchedule",
      tableName: "exam_schedules",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamSchedule;
};
