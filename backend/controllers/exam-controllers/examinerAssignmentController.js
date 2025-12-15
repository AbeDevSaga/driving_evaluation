"use strict";

const { ExaminerAssignment, User, ExamSection } = require("../../models");

/**
 * Create Examiner Assignment
 */
const createAssignment = async (req, res) => {
  try {
    const { examiner_id, section_id } = req.body;

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

    const assignment = await ExaminerAssignment.create({
      examiner_id,
      section_id,
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
    const assignments = await ExaminerAssignment.findAll({
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
    const { examiner_id, section_id } = req.body;

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

    await assignment.update({
      examiner_id: examiner_id ?? assignment.examiner_id,
      section_id: section_id ?? assignment.section_id,
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
