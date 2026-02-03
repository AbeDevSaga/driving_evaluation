"use strict";

const {
  ExamineeExam,
  ExamSchedule,
  Exam,
  User,
  sequelize,
} = require("../../models");
const { Op } = require("sequelize");

/**
 * Create Examinee Exams (Bulk)
 */
const createExamineeExam = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      examinee_ids,
      exam_id,
      exam_schedule_id,
      total_score = 0,
      is_passed = false,
    } = req.body;

    // ===== Validation =====
    if (!Array.isArray(examinee_ids) || examinee_ids.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "examinee_ids must be a non-empty array",
      });
    }

    // ===== Ensure exam exists =====
    const exam = await Exam.findByPk(exam_id, { transaction });
    if (!exam) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // ===== Validate schedule belongs to exam =====
    const schedule = await ExamSchedule.findOne({
      where: {
        schedule_id: exam_schedule_id,
        exam_id,
      },
      transaction,
    });

    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found or does not belong to this exam",
      });
    }

    // ===== Ensure all examinees exist =====
    const examinees = await User.findAll({
      where: { user_id: examinee_ids },
      attributes: ["user_id"],
      transaction,
    });

    if (examinees.length !== examinee_ids.length) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "One or more examinees not found",
      });
    }

    // ===== Prepare bulk insert =====
    const payload = examinee_ids.map((examinee_id) => ({
      examinee_id,
      exam_id,
      exam_schedule_id,
      total_score,
      is_passed,
    }));

    // ===== Create all records =====
    const examineeExams = await ExamineeExam.bulkCreate(payload, {
      transaction,
      returning: true,
    });

    // Commit transaction
    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Examinees assigned to exam successfully",
      data: examineeExams,
    });
  } catch (error) {
    // Rollback on ANY failure
    await transaction.rollback();
    console.error("Create Examinee Exams Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign examinees to exam",
    });
  }
};

/**
 * Get all Examinee Exams
 */
const getExamineeExams = async (req, res) => {
  try {
    const {
      examinee_id,
      schedule_id,
      is_active,
      search, // optional: for name/email search
    } = req.query;

    // ====== Build filters dynamically ======
    const whereClause = {};

    if (schedule_id) whereClause.exam_schedule_id = schedule_id;
    if (examinee_id) whereClause.examinee_id = examinee_id;
    if (is_active !== undefined) whereClause.is_active = is_active === "true";

    if (search) {
      whereClause[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
      ];
    }

    const exams = await ExamineeExam.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "examinee",
          attributes: ["user_id", "full_name", "email"],
        },
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name", "pass_percentage"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Examinee exams fetched successfully",
      data: exams,
    });
  } catch (error) {
    console.error("Get Examinee Exams Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examinee exams",
    });
  }
};

/**
 * Get Examinee Exam by ID
 */
const getExamineeExamById = async (req, res) => {
  try {
    const { id: examinee_exam_id } = req.params;

    const exam = await ExamineeExam.findByPk(examinee_exam_id, {
      include: [
        { model: User, as: "examinee", attributes: ["user_id", "full_name"] },
        { model: Exam, as: "exam", attributes: ["exam_id", "name"] },
        {
          model: ExamSchedule,
          as: "schedule",
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Examinee exam not found",
      });
    }

    return res.status(200).json({ success: true, data: exam });
  } catch (error) {
    console.error("Get Examinee Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examinee exam",
    });
  }
};

/**
 * Get Examinees by Exam Schedule
 */
const getExamineesBySchedule = async (req, res) => {
  try {
    const { exam_schedule_id } = req.params;

    const examinees = await ExamineeExam.findAll({
      where: { exam_schedule_id },
      include: [
        {
          model: User,
          as: "examinee",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: examinees,
    });
  } catch (error) {
    console.error("Get Examinees By Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examinees",
    });
  }
};

/**
 * Update Examinee Exam
 */
const updateExamineeExam = async (req, res) => {
  try {
    const { examinee_exam_id } = req.params;
    const { total_score, is_passed, exam_schedule_id } = req.body;

    const exam = await ExamineeExam.findByPk(examinee_exam_id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Examinee exam not found",
      });
    }

    const schedule = await ExamSchedule.findOne({
      where: {
        exam_schedule_id,
        exam_id: exam.exam_id,
      },
    });

    if (!schedule) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule for this exam",
      });
    }

    await exam.update({
      total_score: total_score ?? exam.total_score,
      is_passed: is_passed ?? exam.is_passed,
      exam_schedule_id: exam_schedule_id ?? schedule.exam_schedule_id,
    });

    return res.status(200).json({
      success: true,
      message: "Examinee exam updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Update Examinee Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update examinee exam",
    });
  }
};

/**
 * Delete Examinee Exam
 */
const deleteExamineeExam = async (req, res) => {
  try {
    const { examinee_exam_id } = req.params;

    const exam = await ExamineeExam.findByPk(examinee_exam_id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Examinee exam not found",
      });
    }

    await exam.destroy();

    return res.status(200).json({
      success: true,
      message: "Examinee exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete Examinee Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete examinee exam",
    });
  }
};

module.exports = {
  createExamineeExam,
  getExamineeExams,
  getExamineeExamById,
  getExamineesBySchedule,
  updateExamineeExam,
  deleteExamineeExam,
};
