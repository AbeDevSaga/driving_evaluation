// models/user.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User belongs to UserType
      User.belongsTo(models.UserType, {
        foreignKey: "user_type_id",
        as: "userType",
      });

      // User belongs to ExternalUserType
      User.belongsTo(models.ExternalUserType, {
        foreignKey: "external_user_type_id",
        as: "externalUserType",
      });

      User.belongsTo(models.StructureNode, {
        foreignKey: "structure_node_id",
        as: "structureNode",
      });

      User.belongsToMany(models.Role, {
        through: models.UserRoles,
        foreignKey: "user_id",
        otherKey: "role_id",
        as: "roles",
      });
      // user can have multiple batches
      User.belongsTo(models.Batch, {
        foreignKey: "batch_id",
        as: "batch",
      });

      // User has many ExamineeExams
      User.hasMany(models.ExamineeExam, {
        foreignKey: "examinee_id",
        as: "examineeExams",
      });

      User.belongsToMany(models.VehicleCategory, {
        through: models.UserVehicleCategory,
        foreignKey: "user_id",
        otherKey: "vehicle_category_id",
        as: "vehicleCategories",
      });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      external_user_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      structure_node_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "structure_nodes",
          key: "structure_node_id",
        },
      },
      batch_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "batches",
          key: "batch_id",
        },
      },

      registration_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_first_logged_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password_changed_at: {
        type: DataTypes.DATE,
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
      modelName: "User",
      tableName: "users",
      timestamps: false,
      underscored: true,
    },
  );

  return User;
};
