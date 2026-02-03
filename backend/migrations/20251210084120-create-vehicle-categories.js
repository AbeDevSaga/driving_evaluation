"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vehicle_categories", {
      vehicle_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      structure_node_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "structure_nodes",
          key: "structure_node_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // ✅ Scoped unique indexes
    await queryInterface.addIndex("vehicle_categories", {
      unique: true,
      fields: ["structure_node_id", "name"],
      name: "uq_vehicle_categories_structure_name",
    });

    await queryInterface.addIndex("vehicle_categories", {
      unique: true,
      fields: ["structure_node_id", "code"],
      name: "uq_vehicle_categories_structure_code",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("vehicle_categories");
  },
};
