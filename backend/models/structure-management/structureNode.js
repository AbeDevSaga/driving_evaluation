"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StructureNode extends Model {
    static associate(models) {
      // Self-referencing parent-child relationship
      StructureNode.belongsTo(models.StructureNode, {
        foreignKey: "parent_id",
        as: "parent",
      });

      StructureNode.hasMany(models.StructureNode, {
        foreignKey: "parent_id",
        as: "children",
      });

      // Has many vehicle categories
      StructureNode.hasMany(models.VehicleCategory, {
        foreignKey: "structure_node_id",
        as: "vehicle_categories",
      });
    }
  }

  StructureNode.init(
    {
      structure_node_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "StructureNode",
      tableName: "structure_nodes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,

      // ✅ Important: uniqueness should be scoped, not global
      indexes: [
        {
          fields: ["parent_id"],
        },
      ],
    },
  );

  return StructureNode;
};
