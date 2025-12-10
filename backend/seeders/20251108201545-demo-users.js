"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ================================
    // 3. Common password hash
    // ================================
    const passwordHash = await bcrypt.hash("password", 10);

    // ================================
    // 4. Insert demo users
    // ================================
    await queryInterface.bulkInsert("users", [
      {
        user_id: uuidv4(),
        full_name: "Admin Account",
        email: "admin@gmail.com",
        password: passwordHash,
        phone_number: "251911000001",
        profile_image: null,
        is_first_logged_in: true,
        last_login_at: null,
        password_changed_at: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
