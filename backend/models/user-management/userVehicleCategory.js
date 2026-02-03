// models/userVehicleCategory.js
"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserVehicleCategory = sequelize.define(
    "UserVehicleCategory",
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      vehicle_category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "user_vehicle_categories",
      timestamps: false,
      underscored: true,
    },
  );

  return UserVehicleCategory;
};
