"use strict";

const {
  VehicleCategory,
  Exam,
  StructureNode,
  sequelize,
} = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

/**
 * =================== Create Vehicle Category ===================
 */
const createVehicleCategory = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { structure_node_id, name, description } = req.body;

    const structureNode = await StructureNode.findByPk(structure_node_id, {
      transaction: t,
    });

    if (!structureNode) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Structure node not found.",
      });
    }

    // ====== Check duplicate ======
    const existing = await VehicleCategory.findOne({
      where: { name },
      transaction: t,
    });

    if (existing) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Vehicle category with this name already exists.",
      });
    }

    const category = await VehicleCategory.create(
      {
        structure_node_id,
        vehicle_category_id: uuidv4(),
        name,
        description,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Vehicle category created successfully",
      data: category,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating vehicle category:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating vehicle category",
      error: error.message,
    });
  }
};

/**
 * =================== Get All Vehicle Categories ===================
 */
const getVehicleCategories = async (req, res) => {
  try {
    const { is_active, search } = req.query;

    const whereClause = {};

    if (is_active !== undefined) {
      whereClause.is_active = is_active === "true";
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const categories = await VehicleCategory.findAll({
      where: whereClause,
      include: [
        {
          model: Exam,
          as: "exams",
          attributes: ["exam_id", "name", "is_active"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Vehicle categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching vehicle categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle categories",
      error: error.message,
    });
  }
};

/**
 * =================== Get Vehicle Category By ID ===================
 */
const getVehicleCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await VehicleCategory.findByPk(id, {
      include: [
        {
          model: Exam,
          as: "exams",
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching vehicle category:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vehicle category",
      error: error.message,
    });
  }
};

/**
 * =================== Update Vehicle Category ===================
 */
const updateVehicleCategory = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const category = await VehicleCategory.findByPk(id, {
      transaction: t,
    });

    if (!category) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found.",
      });
    }

    await category.update(
      {
        ...req.body,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Vehicle category updated successfully",
      data: category,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating vehicle category:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating vehicle category",
      error: error.message,
    });
  }
};

/**
 * =================== Delete Vehicle Category (Soft Delete) ===================
 */
const deleteVehicleCategory = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const category = await VehicleCategory.findByPk(id, {
      transaction: t,
    });

    if (!category) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found.",
      });
    }

    // ====== Prevent delete if exams exist ======
    const examsCount = await Exam.count({
      where: { vehicle_category_id: id },
      transaction: t,
    });

    if (examsCount > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate vehicle category with existing exams.",
      });
    }

    await category.update(
      {
        is_active: false,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Vehicle category deactivated successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting vehicle category:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting vehicle category",
      error: error.message,
    });
  }
};

/**
 * =================== Toggle Vehicle Category Status ===================
 */
const toggleVehicleCategoryStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const category = await VehicleCategory.findByPk(id, {
      transaction: t,
    });

    if (!category) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found.",
      });
    }

    await category.update(
      {
        is_active: !category.is_active,
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Vehicle category ${
        category.is_active ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error toggling vehicle category status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update vehicle category status",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicleCategory,
  getVehicleCategories,
  getVehicleCategoryById,
  updateVehicleCategory,
  deleteVehicleCategory,
  toggleVehicleCategoryStatus,
};
