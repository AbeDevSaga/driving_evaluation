"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSchedule extends Model {
    static associate(models) {
      ExamSchedule.belongsTo(models.Exam, {
        foreignKey: "exam_id",
        as: "exam",
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
      exam_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
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
