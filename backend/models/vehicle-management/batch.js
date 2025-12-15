"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      /** Batch belongs to Vehicle Category */
      Batch.belongsTo(models.VehicleCategory, {
        foreignKey: "vehicle_category_id",
        as: "vehicleCategory",
      });

      /** Batch has many Users */
      Batch.hasMany(models.User, {
        foreignKey: "batch_id",
        as: "users",
      });
    }
  }

  Batch.init(
    {
      batch_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      vehicle_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "vehicle_categories",
          key: "vehicle_category_id",
        },
      },

      /** e.g. BATCH-2025-A-001 */
      batch_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      /** e.g. 2025 Motorcycle Batch 1 */
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "Batch",
      tableName: "batches",
      timestamps: false,
      underscored: true,
    }
  );

  return Batch;
};
