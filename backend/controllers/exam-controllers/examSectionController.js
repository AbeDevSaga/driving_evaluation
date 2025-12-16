"use strict";

const { ExamSection, Exam } = require("../../models");

/**
 * Create Exam Section
 */
const createSection = async (req, res) => {
  try {
    const { exam_id, name, weight_percentage, max_score } = req.body;

    // Ensure exam exists
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const section = await ExamSection.create({
      exam_id,
      name,
      weight_percentage,
      max_score: max_score ?? 100,
    });

    return res.status(201).json({
      success: true,
      message: "Exam section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Exam Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create exam section",
    });
  }
};

/**
 * Get All Exam Sections
 */
const getSections = async (req, res) => {
  try {
    const sections = await ExamSection.findAll({
      include: [
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exam sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Get Exam Sections Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam sections",
    });
  }
};

/**
 * Get Sections By Exam ID
 */
const getSectionsByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const sections = await ExamSection.findAll({
      where: { exam_id },
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exam sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Get Sections By Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam sections",
    });
  }
};

/**
 * Get Single Exam Section
 */
const getSectionById = async (req, res) => {
  try {
    const { section_id } = req.params;

    const section = await ExamSection.findByPk(section_id, {
      include: [
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name"],
        },
      ],
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Exam section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    console.error("Get Exam Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam section",
    });
  }
};

/**
 * Update Exam Section
 */
const updateSection = async (req, res) => {
  try {
    const { section_id } = req.params;
    const { name, weight_percentage, max_score } = req.body;

    const section = await ExamSection.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Exam section not found",
      });
    }

    await section.update({
      name: name ?? section.name,
      weight_percentage: weight_percentage ?? section.weight_percentage,
      max_score: max_score ?? section.max_score,
    });

    return res.status(200).json({
      success: true,
      message: "Exam section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update Exam Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update exam section",
    });
  }
};

/**
 * Delete Exam Section
 */
const deleteSection = async (req, res) => {
  try {
    const { section_id } = req.params;

    const section = await ExamSection.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Exam section not found",
      });
    }

    await section.destroy();

    return res.status(200).json({
      success: true,
      message: "Exam section deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exam Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete exam section",
    });
  }
};

module.exports = {
  createSection,
  getSections,
  getSectionsByExam,
  getSectionById,
  updateSection,
  deleteSection,
};
