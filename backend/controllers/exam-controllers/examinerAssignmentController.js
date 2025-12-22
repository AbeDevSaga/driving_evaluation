"use strict";

const {
  ExaminerAssignment,
  User,
  ExamSection,
  ExamSchedule,
} = require("../../models");

/**
 * Create Examiner Assignment
 */
const createAssignment = async (req, res) => {
  try {
    const { examiner_id, section_id, exam_schedule_id } = req.body;

    // Ensure examiner exists
    const examiner = await User.findByPk(examiner_id);
    if (!examiner) {
      return res.status(404).json({
        success: false,
        message: "Examiner not found",
      });
    }

    // Ensure section exists
    const section = await ExamSection.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Exam section not found",
      });
    }

    // Ensure Schedule exists
    const schedule = await ExamSchedule.findByPk(exam_schedule_id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    const assignment = await ExaminerAssignment.create({
      examiner_id,
      section_id,
      exam_schedule_id,
    });

    return res.status(201).json({
      success: true,
      message: "Examiner assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Create Examiner Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create examiner assignment",
    });
  }
};

/**
 * Get All Examiner Assignments
 */
const getAssignments = async (req, res) => {
  try {
    const { section_id, examiner_id, exam_schedule_id, is_active } = req.query;
    console.log("req.query: ", req.query);

    // ====== Build filters dynamically ======
    const whereClause = {};

    if (section_id) whereClause.section_id = section_id;
    if (examiner_id) whereClause.examiner_id = examiner_id;
    if (exam_schedule_id) whereClause.exam_schedule_id = exam_schedule_id;
    if (is_active !== undefined) whereClause.is_active = is_active === "true";

    const assignments = await ExaminerAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "examiner",
          attributes: ["user_id", "full_name", "email"],
        },
        {
          model: ExamSection,
          as: "section",
          attributes: ["section_id", "name"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
          attributes: ["schedule_id", "exam_date", "location"],
        },
      ],
      order: [["assignment_id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Examiner assignments fetched successfully",
      data: assignments,
    });
  } catch (error) {
    console.error("Get Examiner Assignments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examiner assignments",
    });
  }
};

/**
 * Get Examiner Assignments (Filtered)
 * Filters:
 *  - section_id
 *  - examiner_id
 *  - exam_schedule_id
 */
const getAssignmentsFiltered = async (req, res) => {
  try {
    const { section_id, examiner_id, exam_schedule_id } = req.query;

    // 🔹 Build WHERE condition dynamically
    const where = {};

    if (section_id) where.section_id = section_id;
    if (examiner_id) where.examiner_id = examiner_id;
    if (exam_schedule_id) where.exam_schedule_id = exam_schedule_id;

    const assignments = await ExaminerAssignment.findAll({
      where,
      include: [
        {
          model: User,
          as: "examiner",
          attributes: ["user_id", "full_name", "email"],
        },
        {
          model: ExamSection,
          as: "section",
          attributes: ["section_id", "name"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
          attributes: ["schedule_id", "exam_date", "location"],
        },
      ],
      order: [["assignment_id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Filtered examiner assignments fetched successfully",
      data: assignments,
    });
  } catch (error) {
    console.error("Get Filtered Assignments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examiner assignments",
    });
  }
};

/**
 * Get Single Assignment
 */
const getAssignmentById = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await ExaminerAssignment.findByPk(assignment_id, {
      include: [
        {
          model: User,
          as: "examiner",
          attributes: ["id", "full_name", "email"],
        },
        {
          model: ExamSection,
          as: "section",
          attributes: ["section_id", "name"],
        },
        {
          model: ExamSchedule,
          as: "schedule",
          attributes: ["exam_schedule_id", "exam_date", "location"],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Examiner assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Get Examiner Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch examiner assignment",
    });
  }
};

/**
 * Update Assignment
 */
const updateAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const { examiner_id, section_id, exam_schedule_id } = req.body;

    const assignment = await ExaminerAssignment.findByPk(assignment_id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Examiner assignment not found",
      });
    }

    if (examiner_id) {
      const examiner = await User.findByPk(examiner_id);
      if (!examiner) {
        return res
          .status(404)
          .json({ success: false, message: "Examiner not found" });
      }
    }

    if (section_id) {
      const section = await ExamSection.findByPk(section_id);
      if (!section) {
        return res
          .status(404)
          .json({ success: false, message: "Exam section not found" });
      }
    }

    if (exam_schedule_id) {
      const schedule = await ExamSchedule.findByPk(exam_schedule_id);
      if (!schedule) {
        return res
          .status(404)
          .json({ success: false, message: "Schedule not found" });
      }
    }

    await assignment.update({
      examiner_id: examiner_id ?? assignment.examiner_id,
      section_id: section_id ?? assignment.section_id,
      exam_schedule_id: exam_schedule_id ?? assignment.exam_schedule_id,
    });

    return res.status(200).json({
      success: true,
      message: "Examiner assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Update Examiner Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update examiner assignment",
    });
  }
};

/**
 * Delete Assignment
 */
const deleteAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await ExaminerAssignment.findByPk(assignment_id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Examiner assignment not found",
      });
    }

    await assignment.destroy();

    return res.status(200).json({
      success: true,
      message: "Examiner assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Examiner Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete examiner assignment",
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
