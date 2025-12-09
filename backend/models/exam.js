"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      // Exam has many ExamSections
      Exam.hasMany(models.ExamSection, {
        foreignKey: "exam_id",
        as: "sections",
        onDelete: "CASCADE",
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
      total_weight: {
        type: DataTypes.INTEGER,
        defaultValue: 100, // ALWAYS 100
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
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Exam",
      tableName: "exams",
      timestamps: false,
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );

  return Exam;
};
