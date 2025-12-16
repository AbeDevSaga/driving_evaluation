"use strict";

const { ExamineeExam, ExamSchedule, Exam, User } = require("../../models");

/**
 * Create Examinee Exam
 */
const createExamineeExam = async (req, res) => {
  try {
    const { examinee_id, exam_id, total_score, is_passed, exam_schedule_id } =
      req.body;

    // Ensure examinee exists
    const examinee = await User.findByPk(examinee_id);
    if (!examinee) {
      return res.status(404).json({
        success: false,
        message: "Examinee not found",
      });
    }

    // Ensure exam exists
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Validate schedule
    const schedule = await ExamSchedule.findOne({
      where: {
        exam_schedule_id,
        exam_id,
      },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found or does not belong to this exam",
      });
    }

    const examineeExam = await ExamineeExam.create({
      examinee_id,
      exam_id,
      exam_schedule_id,
      total_score,
      is_passed,
    });

    return res.status(201).json({
      success: true,
      message: "Examinee exam created successfully",
      data: examineeExam,
    });
  } catch (error) {
    console.error("Create Examinee Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create examinee exam",
    });
  }
};

/**
 * Get all Examinee Exams
 */
const getExamineeExams = async (req, res) => {
  try {
    const exams = await ExamineeExam.findAll({
      include: [
        {
          model: User,
          as: "examinee",
          attributes: ["id", "full_name", "email"],
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
    const { examinee_exam_id } = req.params;

    const exam = await ExamineeExam.findByPk(examinee_exam_id, {
      include: [
        { model: User, as: "examinee", attributes: ["id", "full_name"] },
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
