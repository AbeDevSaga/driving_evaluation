"use strict";

const { Batch, VehicleCategory, User } = require("../../models");

/**
 * Create Batch
 */
const createBatch = async (req, res) => {
  try {
    const { vehicle_category_id, batch_code, name, year } = req.body;

    // Ensure vehicle category exists
    const category = await VehicleCategory.findByPk(vehicle_category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found",
      });
    }

    // Ensure batch code is unique
    const existingBatch = await Batch.findOne({ where: { batch_code } });
    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: "Batch code already exists",
      });
    }

    const batch = await Batch.create({
      vehicle_category_id,
      batch_code,
      name,
      year,
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
    console.error("Create Batch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create batch",
    });
  }
};

/**
 * Get All Batches
 */
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: VehicleCategory,
          as: "vehicleCategory",
          attributes: ["vehicle_category_id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Batches fetched successfully",
      data: batches,
    });
  } catch (error) {
    console.error("Get Batches Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};

/**
 * Get Batches By Vehicle Category
 */
const getBatchesByCategory = async (req, res) => {
  try {
    const { vehicle_category_id } = req.params;

    const batches = await Batch.findAll({
      where: { vehicle_category_id },
      order: [["year", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Batches fetched successfully",
      data: batches,
    });
  } catch (error) {
    console.error("Get Batches By Category Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};

/**
 * Get Single Batch
 */
const getBatchById = async (req, res) => {
  try {
    const { batch_id } = req.params;

    const batch = await Batch.findByPk(batch_id, {
      include: [
        {
          model: VehicleCategory,
          as: "vehicleCategory",
          attributes: ["vehicle_category_id", "name"],
        },
        {
          model: User,
          as: "users",
          attributes: ["user_id", "full_name", "email"],
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error("Get Batch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batch",
    });
  }
};

/**
 * Update Batch
 */
const updateBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const { batch_code, name, year, is_active } = req.body;

    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await batch.update({
      batch_code: batch_code ?? batch.batch_code,
      name: name ?? batch.name,
      year: year ?? batch.year,
      is_active: is_active ?? batch.is_active,
    });

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (error) {
    console.error("Update Batch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update batch",
    });
  }
};

/**
 * Delete Batch
 */
const deleteBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;

    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await batch.destroy();

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error("Delete Batch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete batch",
    });
  }
};

module.exports = {
  createBatch,
  getBatches,
  getBatchesByCategory,
  getBatchById,
  updateBatch,
  deleteBatch,
};
