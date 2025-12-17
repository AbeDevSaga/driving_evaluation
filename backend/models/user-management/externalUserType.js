"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExternalUserType extends Model {
    static associate(models) {
      // A UserType can have many Users
      this.hasMany(models.User, {
        foreignKey: "external_user_type_id",
        as: "users",
      });
    }
  }

  ExternalUserType.init(
    {
      external_user_type_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ExternalUserType",
      tableName: "external_user_types",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ExternalUserType;
};
