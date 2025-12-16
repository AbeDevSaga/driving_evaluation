"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VehicleCategory extends Model {
    static associate(models) {
      // One category can have many exams
      VehicleCategory.hasMany(models.Exam, {
        foreignKey: "vehicle_category_id",
        as: "exams",
      });
    }
  }

  VehicleCategory.init(
    {
      vehicle_category_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        // e.g. Motorcycle, Light Vehicle, Heavy Truck
      },

      code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
        // e.g. A, B, C, D, CE
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      modelName: "VehicleCategory",
      tableName: "vehicle_categories",
      timestamps: false,
      underscored: true,
    }
  );

  return VehicleCategory;
};
