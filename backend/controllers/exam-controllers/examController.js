"use strict";

const {
  Exam,
  ExamSection,
  ExamSchedule,
  VehicleCategory,
  sequelize,
} = require("../../models");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

/**
 * =================== Create Exam ===================
 */
const createExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, pass_percentage, vehicle_category_id } =
      req.body;

    // ====== Check duplicate exam name ======
    const category = await VehicleCategory.findByPk(vehicle_category_id, {
      transaction: t,
    });

    if (!category) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found.",
      });
    }

    // ====== Check duplicate exam name ======
    const existingExam = await Exam.findOne({
      where: { name },
      transaction: t,
    });

    if (existingExam) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Exam with this name already exists.",
      });
    }

    // ====== Create Exam ======
    const exam = await Exam.create(
      {
        exam_id: uuidv4(),
        name,
        description,
        pass_percentage,
        vehicle_category_id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating exam",
      error: error.message,
    });
  }
};

/**
 * =================== Get All Exams ===================
 */
const getExams = async (req, res) => {
  try {
    const { is_active, search, vehicle_category_id } = req.query;

    const whereClause = {};

    if (is_active !== undefined) {
      whereClause.is_active = is_active === "true";
    }
    if (vehicle_category_id) {
      whereClause.vehicle_category_id = vehicle_category_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const exams = await Exam.findAll({
      where: whereClause,
      include: [
        {
          model: ExamSection,
          as: "sections",
          attributes: ["section_id", "name", "weight_percentage"],
        },
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
      message: "Exams fetched successfully",
      data: exams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
      error: error.message,
    });
  }
};

/**
 * =================== Get Exam By ID ===================
 */
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(id, {
      include: [
        {
          model: ExamSection,
          as: "sections",
        },
        {
          model: ExamSchedule,
          as: "schedules",
        },
        {
          model: VehicleCategory,
          as: "vehicleCategory",
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam fetched successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Error fetching exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching exam",
      error: error.message,
    });
  }
};

/**
 * =================== Update Exam ===================
 */
const updateExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(id, { transaction: t });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    await exam.update(
      {
        ...req.body,
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating exam",
      error: error.message,
    });
  }
};

/**
 * =================== Delete Exam (Soft Delete) ===================
 */
const deleteExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id, { transaction: t });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    await exam.update(
      {
        is_active: false,
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Exam deactivated successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting exam",
      error: error.message,
    });
  }
};

/**
 * =================== Toggle Exam Active Status ===================
 */
const toggleExamActiveStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(id, { transaction: t });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found.",
      });
    }

    await exam.update(
      {
        is_active: !exam.is_active,
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Exam ${
        exam.is_active ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error toggling exam status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update exam status",
      error: error.message,
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  toggleExamActiveStatus,
};
