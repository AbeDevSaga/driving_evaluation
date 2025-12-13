"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("user_types", [
      {
        user_type_id: uuidv4(),
        name: "internal",
        description:
          "Internal system users such as administrators, examiners, and staff.",
        created_at: now,
        updated_at: now,
      },
      {
        user_type_id: uuidv4(),
        name: "external",
        description:
          "External users such as examinees who take driving license exams.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_types", {
      name: ["internal", "external"],
    });
  },
};
