"use strict";

const { StructureNode, sequelize } = require("../../models");
const { v4: uuidv4, validate: isUuid } = require("uuid");
const { Op } = require("sequelize");

/**
 * =================== Create Structure Node ===================
 */
const createStructureNode = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, parent_id, level } = req.body;

    // ===== Check duplicate name under the same parent =====
    const existingNode = await StructureNode.findOne({
      where: { name, parent_id: parent_id || null },
      transaction: t,
    });

    if (existingNode) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "A node with this name already exists under the same parent.",
      });
    }

    // ===== Create Node =====
    const node = await StructureNode.create(
      {
        structure_node_id: uuidv4(),
        name,
        description,
        parent_id: parent_id || null,
        level: level || 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Structure node created successfully",
      data: node,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating structure node:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating structure node",
      error: error.message,
    });
  }
};

/**
 * =================== Get All Structure Nodes ===================
 */
const getStructureNodes = async (req, res) => {
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

    const nodes = await StructureNode.findAll({
      where: whereClause,
      include: [
        {
          model: StructureNode,
          as: "children",
        },
        {
          model: StructureNode,
          as: "parent",
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Structure nodes fetched successfully",
      data: nodes,
    });
  } catch (error) {
    console.error("Error fetching structure nodes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch structure nodes",
      error: error.message,
    });
  }
};

/**
 * =================== Get Structure Node By ID ===================
 */
const getStructureNodeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid structure node ID format.",
      });
    }

    const node = await StructureNode.findByPk(id, {
      include: [
        { model: StructureNode, as: "children" },
        { model: StructureNode, as: "parent" },
      ],
    });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Structure node not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Structure node fetched successfully",
      data: node,
    });
  } catch (error) {
    console.error("Error fetching structure node:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching structure node",
      error: error.message,
    });
  }
};

/**
 * =================== Update Structure Node ===================
 */
const updateStructureNode = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid structure node ID format.",
      });
    }

    const node = await StructureNode.findByPk(id, { transaction: t });

    if (!node) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Structure node not found.",
      });
    }

    await node.update(
      {
        ...req.body,
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Structure node updated successfully",
      data: node,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating structure node:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating structure node",
      error: error.message,
    });
  }
};

/**
 * =================== Delete Structure Node (Soft Delete) ===================
 */
const deleteStructureNode = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid structure node ID format.",
      });
    }

    const node = await StructureNode.findByPk(id, { transaction: t });

    if (!node) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Structure node not found.",
      });
    }

    await node.update(
      { is_active: false, updated_at: new Date() },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Structure node deactivated successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting structure node:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting structure node",
      error: error.message,
    });
  }
};

/**
 * =================== Toggle Structure Node Active Status ===================
 */
const toggleStructureNodeActiveStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid structure node ID format.",
      });
    }

    const node = await StructureNode.findByPk(id, { transaction: t });

    if (!node) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Structure node not found.",
      });
    }

    await node.update(
      { is_active: !node.is_active, updated_at: new Date() },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Structure node ${
        node.is_active ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error toggling structure node status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update structure node status",
      error: error.message,
    });
  }
};

module.exports = {
  createStructureNode,
  getStructureNodes,
  getStructureNodeById,
  updateStructureNode,
  deleteStructureNode,
  toggleStructureNodeActiveStatus,
};
