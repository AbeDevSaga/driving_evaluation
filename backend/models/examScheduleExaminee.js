"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamScheduleExaminee extends Model {
    static associate(models) {
      ExamScheduleExaminee.belongsTo(models.User, {
        foreignKey: "examinee_id",
        as: "examinee",
      });

      ExamScheduleExaminee.belongsTo(models.ExamSchedule, {
        foreignKey: "schedule_id",
        as: "schedule",
      });
    }
  }

  ExamScheduleExaminee.init(
    {
      schedule_examinee_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      schedule_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      examinee_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "ExamScheduleExaminee",
      tableName: "exam_schedule_examinees",
      timestamps: false,
      underscored: true,
    }
  );

  return ExamScheduleExaminee;
};
