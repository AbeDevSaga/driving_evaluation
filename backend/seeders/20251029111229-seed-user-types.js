"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("user_types", [
      {
        user_type_id: uuidv4(),
        name: "test_one",
        description: "Test user type one for development or testing purposes.",
        created_at: now,
        updated_at: now,
      },
      {
        user_type_id: uuidv4(),
        name: "test_two",
        description: "Test user type two for development or testing purposes.",
        created_at: now,
        updated_at: now,
      },
      {
        user_type_id: uuidv4(),
        name: "test_three",
        description:
          "Test user type three for development or testing purposes.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_types", null, {});
  },
};
