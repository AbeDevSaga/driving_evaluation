"use strict";

const { ExamSchedule, Exam } = require("../../models");

/**
 * Create Exam Schedule
 */
const createSchedule = async (req, res) => {
  try {
    const { exam_id, exam_date, location } = req.body;

    // Ensure exam exists
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const schedule = await ExamSchedule.create({
      exam_id,
      exam_date,
      location,
    });

    return res.status(201).json({
      success: true,
      message: "Exam schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Create Exam Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create exam schedule",
    });
  }
};

/**
 * Get All Exam Schedules
 */
const getSchedules = async (req, res) => {
  try {
    const schedules = await ExamSchedule.findAll({
      include: [
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name", "pass_percentage"],
        },
      ],
      order: [["exam_date", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exam schedules fetched successfully",
      data: schedules,
    });
  } catch (error) {
    console.error("Get Exam Schedules Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam schedules",
    });
  }
};

/**
 * Get Schedules By Exam ID
 */
const getSchedulesByExam = async (req, res) => {
  try {
    const { exam_id } = req.params;

    const schedules = await ExamSchedule.findAll({
      where: { exam_id },
      order: [["exam_date", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Exam schedules fetched successfully",
      data: schedules,
    });
  } catch (error) {
    console.error("Get Schedules By Exam Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam schedules",
    });
  }
};

/**
 * Get Single Exam Schedule
 */
const getScheduleById = async (req, res) => {
  try {
    const { id: schedule_id } = req.params;
    // console.log("req.params: ", req.params, "schedule_id: ", schedule_id);

    const schedule = await ExamSchedule.findByPk(schedule_id, {
      include: [
        {
          model: Exam,
          as: "exam",
          attributes: ["exam_id", "name"],
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error("Get Exam Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exam schedule",
    });
  }
};

/**
 * Update Exam Schedule
 */
const updateSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const { exam_date, location, is_active } = req.body;

    const schedule = await ExamSchedule.findByPk(schedule_id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    await schedule.update({
      exam_date: exam_date ?? schedule.exam_date,
      location: location ?? schedule.location,
      is_active: is_active ?? schedule.is_active,
    });

    return res.status(200).json({
      success: true,
      message: "Exam schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Update Exam Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update exam schedule",
    });
  }
};

/**
 * Delete Exam Schedule
 */
const deleteSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    const schedule = await ExamSchedule.findByPk(schedule_id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Exam schedule not found",
      });
    }

    await schedule.destroy();

    return res.status(200).json({
      success: true,
      message: "Exam schedule deleted successfully",
    });
  } catch (error) {
    console.error("Delete Exam Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete exam schedule",
    });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getSchedulesByExam,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
