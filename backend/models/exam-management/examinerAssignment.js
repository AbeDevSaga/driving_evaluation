"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExaminerAssignment extends Model {
    static associate(models) {
      ExaminerAssignment.belongsTo(models.User, {
        foreignKey: "examiner_id",
        as: "examiner",
      });

      ExaminerAssignment.belongsTo(models.ExamSection, {
        foreignKey: "section_id",
        as: "section",
      });
    }
  }

  ExaminerAssignment.init(
    {
      assignment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      examiner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      section_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ExaminerAssignment",
      tableName: "examiner_assignments",
      timestamps: false,
      underscored: true,
    }
  );

  return ExaminerAssignment;
};
