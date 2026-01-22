const {
  User,
  UserType,
  ExternalUserType,
  UserPosition,
  StructureNode,
  VehicleCategory,
  RolePermission,
  Permission,
  Role,
  Batch,
  UserRoles,
  sequelize,
} = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateRandomPassword } = require("../../utils/password");
const { sendEmail } = require("../../utils/sendEmail");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

const getUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.findAll({
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "User types fetched successfully",
      data: userTypes,
    });
  } catch (error) {
    console.error("Error fetching user types:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user types",
      error: error.message,
    });
  }
};
const getExternalUserTypes = async (req, res) => {
  try {
    const userTypes = await ExternalUserType.findAll({
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "External User types fetched successfully",
      data: userTypes,
    });
  } catch (error) {
    console.error("Error fetching user types:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user types",
      error: error.message,
    });
  }
};
const getUserPositions = async (req, res) => {
  try {
    const userPositions = await UserPosition.findAll({
      attributes: [
        "user_position_id",
        "name",
        "description",
        "created_at",
        "updated_at",
      ],
      order: [["name", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "User positions fetched successfully",
      data: userPositions,
    });
  } catch (error) {
    console.error("Error fetching user positions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user positions",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      full_name,
      email,
      user_type_id,
      external_user_type_id,
      vehicle_category_id,
      batch_id,
      role_ids,
      phone_number,
      structure_node_id,
    } = req.body;

    // ====== Check existing email ======
    const existingUser = await User.findOne({
      where: { email },
      transaction: t,
    });
    if (existingUser) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    if (!user_type_id) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "User type is required." });
    }

    // ====== Validate user type ======
    const userType = await UserType.findByPk(user_type_id, { transaction: t });
    if (!userType) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Invalid user type." });
    }

    // ====== Validate External user type ======
    if (external_user_type_id) {
      const externalUserType = await ExternalUserType.findByPk(
        external_user_type_id,
        { transaction: t },
      );
      if (!externalUserType) {
        await t.rollback();
        return res
          .status(400)
          .json({ success: false, message: "Invalid external user type." });
      }
    }

    // ====== STRUCTURE NODE VALIDATION FOR EXTERNAL USERS ======

    if (!structure_node_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Structure node is required",
      });
    }
    // Validate structure node exists
    const structureNode = await StructureNode.findByPk(structure_node_id, {
      transaction: t,
    });

    if (!structureNode) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid structure node.",
      });
    }
    // Optional: Validate structure node is active
    if (!structureNode.is_active) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "The selected structure node is not active.",
      });
    }

    // Validate Vehicle category if exists

    if (vehicle_category_id) {
      const vehicleCategory = await VehicleCategory.findByPk(
        vehicle_category_id,
        {
          transaction: t,
        },
      );
      if (!vehicleCategory) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid vehicle category.",
        });
      }
      if (!vehicleCategory.is_active) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "The selected vehicle category is not active.",
        });
      }
    }

    // ====== MULTIPLE ROLE VALIDATION ======
    if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
      const roles = await Role.findAll({
        where: { role_id: role_ids },
        transaction: t,
      });

      if (roles.length !== role_ids.length) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "One or more provided role IDs are invalid.",
        });
      }
    }

    // ====== Generate password ======
    // const password = generateRandomPassword();
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, 10);

    // ====== Create User ======
    const user = await User.create(
      {
        user_id: uuidv4(),
        full_name,
        email,
        password: hashedPassword,
        phone_number,
        user_type_id,
        external_user_type_id,
        structure_node_id: structure_node_id,
        batch_id: batch_id ? batch_id : null,
        vehicle_category_id: vehicle_category_id ? vehicle_category_id : null,
        is_first_logged_in: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    // =======================================================
    // 🔵 MULTIPLE ROLE ASSIGNMENT
    // =======================================================
    if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
      const roleAssignments = role_ids.map((rid) => ({
        user_role_id: uuidv4(),
        user_id: user.user_id,
        role_id: rid,
        assigned_by: req.user?.user_id || null,
        assigned_at: new Date(),
        is_active: true,
      }));

      await UserRoles.bulkCreate(roleAssignments, { transaction: t });
    }

    await t.commit();

    // ====== Send welcome email ======
    await sendEmail(
      email,
      `Welcome to ${process.env.APP_NAME}!`,
      `
      Dear ${full_name},
      Your account has been successfully created.
      Email: ${email}
      Temporary Password: ${password}
      Please change your password after first login.
      ${structureNode ? `Assigned Structure: ${structureNode?.name}` : ""}
    `,
    );

    return res.status(201).json({
      success: true,
      message: "User registered globally (no roles assigned yet)",
      data: user,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============== Update user ===============
const updateUser = async (req, res) => {
  // console.log("update user reached")

  const t = await sequelize.transaction();
  try {
    const { id: user_id } = req.params;
    const {
      full_name,
      email,
      user_type_id,
      phone_number,
      is_active,
      role_ids,
    } = req.body;

    // ====== Find user ======
    const user = await User.findByPk(user_id, { transaction: t });
    console.log("user: ", user, "user_idL ", user_id, req.params);
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ====== Check for email duplication ======
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email },
        transaction: t,
      });
      if (existingEmail) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another user.",
        });
      }
    }

    // ====== Validate user type ======
    if (user_type_id) {
      const userType = await UserType.findByPk(user_type_id, {
        transaction: t,
      });
      if (!userType) {
        await t.rollback();
        return res
          .status(400)
          .json({ success: false, message: "Invalid user type." });
      }
    }

    // ====== Update user ======
    await user.update(
      {
        full_name: full_name ?? user.full_name,
        email: email ?? user.email,
        phone_number: phone_number ?? user.phone_number,
        user_type_id: user_type_id ?? user.user_type_id,
        is_active: is_active ?? user.is_active,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    // ====== Update roles if provided ======
    if (role_ids && Array.isArray(role_ids)) {
      // Validate roles exist
      const roles = await Role.findAll({
        where: { role_id: role_ids },
        transaction: t,
      });
      if (roles.length !== role_ids.length) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "One or more provided role IDs are invalid.",
        });
      }

      // Delete old roles
      await UserRoles.destroy({
        where: { user_id },
        transaction: t,
      });

      // Assign new roles
      const roleAssignments = role_ids.map((rid) => ({
        user_role_id: uuidv4(),
        user_id,
        role_id: rid,
        assigned_by: req.user?.user_id || null,
        assigned_at: new Date(),
        is_active: true,
      }));
      await UserRoles.bulkCreate(roleAssignments, { transaction: t });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ============Get all users=====================
const getUsers = async (req, res) => {
  try {
    const {
      structure_node_id,
      user_type_id,
      external_user_type_id,
      batch_id,
      is_active,
      search, // optional: for name/email search
    } = req.query;

    // ====== Build filters dynamically ======
    const whereClause = {};

    if (structure_node_id) whereClause.structure_node_id = structure_node_id;
    if (user_type_id) whereClause.user_type_id = user_type_id;
    if (external_user_type_id)
      whereClause.external_user_type_id = external_user_type_id;
    if (batch_id) whereClause.batch_id = batch_id;
    if (is_active !== undefined) whereClause.is_active = is_active === "true";

    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
      ];
    }

    // ====== Fetch users with associations ======
    const users = await User.findAll({
      where: whereClause,
      include: [
        {
          model: UserType,
          as: "userType",
          attributes: ["user_type_id", "name"],
        },
        {
          model: ExternalUserType,
          as: "externalUserType",
          attributes: ["external_user_type_id", "name"],
        },
        {
          model: StructureNode,
          as: "structureNode",
          attributes: ["structure_node_id", "name"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["batch_code", "name", "year"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    console.log("user_id: ", user_id);

    // ====== Find user with relations ======
    const user = await User.findByPk(user_id, {
      include: [
        {
          model: UserType,
          as: "userType",
          attributes: ["user_type_id", "name"],
        },
        {
          model: ExternalUserType,
          as: "externalUserType",
          attributes: ["external_user_type_id", "name"],
        },
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: "permissions", // This alias should match the association in Role model
              through: {
                model: RolePermission,
                attributes: [], // Exclude RolePermission attributes if not needed
                as: "rolePermissions", // This matches the association alias in Role model
              },
              attributes: ["permission_id", "resource", "action"], // Select specific permission fields
            },
          ],
        },
        {
          model: StructureNode,
          as: "structureNode",
          through: { attributes: [] },
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["batch_code", "name", "year"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Soft delete (deactivate)
    await user.update(
      { is_active: false, updated_at: new Date() },
      { transaction: t },
    );
    await t.commit();

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Error deactivating user",
      error: error.message,
    });
  }
};
const toggleUserActiveStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { is_active } = req.body; // expect boolean true/false

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    if (typeof is_active !== "boolean") {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "is_active must be a boolean value.",
      });
    }

    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.update(
      { is_active, updated_at: new Date() },
      { transaction: t },
    );
    await t.commit();

    return res.status(200).json({
      success: true,
      message: `User ${is_active ? "activated" : "deactivated"} successfully.`,
      data: { user_id: id, is_active },
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Error toggling user status",
      error: error.message,
    });
  }
};

const resetUserPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format.",
      });
    }

    const user = await User.findByPk(id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Generate and hash new password
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update(
      {
        password: hashedPassword,
        is_first_logged_in: false,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    // Send email notification
    await sendEmail(
      user.email,
      `Password Reset - ${process.env.APP_NAME}`,
      `
      Dear ${user.full_name},
      Your password has been reset successfully.
      Email: ${user.email}
      New Temporary Password: ${newPassword}
      Please change your password after logging in.
      `,
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. The new password has been sent via email.",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Error resetting user password",
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: [
        "user_id",
        "full_name",
        "email",
        "phone_number",
        "position",
        "profile_image",
        "is_first_logged_in",
        "last_login_at",
        "password_changed_at",
        "is_active",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: UserType,
          as: "userType",
          attributes: ["user_type_id", "name", "description"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["batch_code", "name", "year"],
        },
      ],
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Export users
const exportUsers = async (req, res) => {
  try {
    let {
      format,
      user_type_id,
      structure_node_id,
      batch_id,
      is_active,
      search,
    } = req.query;

    if (!format) format = "csv"; // default export

    // ====== Build filters dynamically ======
    const whereClause = {};

    if (structure_node_id) whereClause.structure_node_id = structure_node_id;
    if (user_type_id) whereClause.user_type_id = user_type_id;
    if (batch_id) whereClause.batch_id = batch_id;
    if (is_active !== undefined) whereClause.is_active = is_active === "true";

    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
      ];
    }

    // ====== Fetch users with minimal fields ======
    const users = await User.findAll({
      where: whereClause,
      include: [
        {
          model: UserType,
          as: "userType",
          attributes: ["name"],
        },
        {
          model: StructureNode,
          as: "structureNode",
          attributes: ["structure_node_id", "name"],
        },
        {
          model: Batch,
          as: "batch",
          attributes: ["batch_code", "name", "year"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for export.",
      });
    }

    // Convert to plain object
    const data = users.map((u) => ({
      full_name: u.full_name,
      email: u.email,
      phone_number: u.phone_number,
      user_type: u.userType?.name || "",
      batch: u.batch?.name || "",
      structure: u.structureNode?.name || "",
      is_active: u.is_active ? "Active" : "Inactive",
      created_at: u.created_at,
    }));

    // ====================================================
    //  EXPORT: CSV
    // ====================================================
    if (format === "csv") {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);

      res.header("Content-Type", "text/csv");
      res.attachment("users.csv");
      return res.send(csv);
    }

    // ====================================================
    //  EXPORT: Excel (.xlsx)
    // ====================================================
    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Users");

      sheet.columns = [
        { header: "Full Name", key: "full_name", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "Phone Number", key: "phone_number", width: 20 },
        { header: "User Type", key: "user_type", width: 20 },
        { header: "Structure", key: "structure", width: 20 },
        { header: "Batch", key: "batch", width: 20 },
        { header: "Status", key: "is_active", width: 15 },
        { header: "Created At", key: "created_at", width: 25 },
      ];

      sheet.addRows(data);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

      await workbook.xlsx.write(res);
      return res.end();
    }

    return res.status(400).json({
      success: false,
      message: "Invalid export format. Valid: csv, xlsx",
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export users.",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActiveStatus,
  resetUserPassword,
  getProfile,
  getUserTypes,
  getExternalUserTypes,
  getUserPositions,
  exportUsers,
};
