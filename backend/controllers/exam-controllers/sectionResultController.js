"use strict";

const {
  SectionResult,
  ExamineeExam,
  ExamSection,
  User,
} = require("../../models");

/**
 * Create Section Result
 */
const createSectionResult = async (req, res) => {
  try {
    const { examinee_exam_id, section_id, examiner_id, score, remarks } =
      req.body;

    // Ensure examinee exam exists
    const examineeExam = await ExamineeExam.findByPk(examinee_exam_id);
    if (!examineeExam) {
      return res.status(404).json({
        success: false,
        message: "Examinee exam not found",
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

    // Ensure examiner exists
    const examiner = await User.findByPk(examiner_id);
    if (!examiner) {
      return res.status(404).json({
        success: false,
        message: "Examiner not found",
      });
    }

    const sectionResult = await SectionResult.create({
      examinee_exam_id,
      section_id,
      examiner_id,
      score,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: "Section result created successfully",
      data: sectionResult,
    });
  } catch (error) {
    console.error("Create Section Result Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create section result",
    });
  }
};

/**
 * Get All Section Results
 */
const getSectionResults = async (req, res) => {
  try {
    const results = await SectionResult.findAll({
      include: [
        { model: ExamineeExam, as: "examineeExam" },
        { model: ExamSection, as: "section" },
        { model: User, as: "examiner", attributes: ["id", "name"] },
      ],
      order: [["section_result_id", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Section results fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Get Section Results Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch section results",
    });
  }
};

/**
 * Get Section Result By ID
 */
const getSectionResultById = async (req, res) => {
  try {
    const { section_result_id } = req.params;

    const result = await SectionResult.findByPk(section_result_id, {
      include: [
        { model: ExamineeExam, as: "examineeExam" },
        { model: ExamSection, as: "section" },
        { model: User, as: "examiner", attributes: ["id", "name"] },
      ],
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Section result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get Section Result Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch section result",
    });
  }
};

/**
 * Update Section Result
 */
const updateSectionResult = async (req, res) => {
  try {
    const { section_result_id } = req.params;
    const { score, remarks } = req.body;

    const result = await SectionResult.findByPk(section_result_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Section result not found",
      });
    }

    await result.update({
      score: score ?? result.score,
      remarks: remarks ?? result.remarks,
    });

    return res.status(200).json({
      success: true,
      message: "Section result updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Section Result Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update section result",
    });
  }
};

/**
 * Delete Section Result
 */
const deleteSectionResult = async (req, res) => {
  try {
    const { section_result_id } = req.params;

    const result = await SectionResult.findByPk(section_result_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Section result not found",
      });
    }

    await result.destroy();

    return res.status(200).json({
      success: true,
      message: "Section result deleted successfully",
    });
  } catch (error) {
    console.error("Delete Section Result Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete section result",
    });
  }
};

module.exports = {
  createSectionResult,
  getSectionResults,
  getSectionResultById,
  updateSectionResult,
  deleteSectionResult,
};
