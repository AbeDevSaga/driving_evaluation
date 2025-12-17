"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("external_user_types", [
      {
        external_user_type_id: uuidv4(),
        name: "examinee",
        description:
          "External users such as examinees who take driving license exams.",
        created_at: now,
        updated_at: now,
      },
      {
        external_user_type_id: uuidv4(),
        name: "examiner",
        description: "System users such as examiners who evaluate examinees.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("external_user_types", {
      name: ["examinee", "examiner"],
    });
  },
};
