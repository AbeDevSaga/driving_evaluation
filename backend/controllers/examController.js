// controllers/examController.js

const { Exam, ExamSection } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Sequelize } = require("sequelize");

// ===============================
// CREATE EXAM
// ===============================
const createExam = async (req, res) => {
  const t = await Exam.sequelize.transaction();
  try {
    const { name, description } = req.body;

    // Check duplicate
    const existing = await Exam.findOne({
      where: { name, is_active: true },
      transaction: t,
    });
    if (existing) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Exam with this name already exists",
      });
    }

    const exam = await Exam.create(
      {
        exam_id: uuidv4(),
        name,
        description,
        total_weight: 100,
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
    if (!t.finished) await t.rollback();
    console.error("Error creating exam:", error);
    return res.status(500).json({
      success: false,
      message: "Internal error creating exam",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL EXAMS
// ===============================
const getExams = async (req, res) => {
  try {
    const { is_active } = req.query;

    const whereClause = {};
    if (is_active !== undefined) whereClause.is_active = is_active === "true";

    const exams = await Exam.findAll({
      where: whereClause,
      include: [
        {
          model: ExamSection,
          as: "sections",
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching exams",
      error: error.message,
    });
  }
};

// ===============================
// GET EXAM BY ID (with sections)
// ===============================
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findOne({
      where: { exam_id: id, is_active: true },
      include: [
        {
          model: ExamSection,
          as: "sections",
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
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

// ===============================
// UPDATE EXAM
// ===============================
const updateExam = async (req, res) => {
  const t = await Exam.sequelize.transaction();

  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const exam = await Exam.findOne({
      where: { exam_id: id, is_active: true },
      transaction: t,
    });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Prevent duplicate name
    if (name && name !== exam.name) {
      const exists = await Exam.findOne({
        where: { name, is_active: true },
        transaction: t,
      });
      if (exists) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Another exam with this name already exists",
        });
      }
    }

    await exam.update(
      {
        name: name ?? exam.name,
        description: description ?? exam.description,
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
    if (!t.finished) await t.rollback();
    console.error("Error updating exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating exam",
      error: error.message,
    });
  }
};

// ===============================
// DELETE EXAM (SOFT DELETE)
// ===============================
const deleteExam = async (req, res) => {
  const t = await Exam.sequelize.transaction();
  try {
    const { id } = req.params;

    const exam = await Exam.findOne({
      where: { exam_id: id, is_active: true },
      transaction: t,
    });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await exam.update(
      {
        is_active: false,
        deleted_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    if (!t.finished) await t.rollback();
    console.error("Error deleting exam:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting exam",
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
};
