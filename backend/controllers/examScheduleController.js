// controllers/examScheduleController.js
const {
  ExamSchedule,
  Exam,
  ExamSectionEvaluation,
  ExamScheduleExaminee,
  User,
} = require("../models");

const { v4: uuidv4 } = require("uuid");

module.exports = {
  // ================================================================
  // CREATE SCHEDULE
  // ================================================================
  createSchedule: async (req, res) => {
    const t = await ExamSchedule.sequelize.transaction();
    try {
      const { exam_id, date, start_time, end_time, examinee_ids } = req.body;

      // Create schedule
      const schedule = await ExamSchedule.create(
        {
          schedule_id: uuidv4(),
          exam_id,
          date,
          start_time,
          end_time,
        },
        { transaction: t }
      );

      // Add examinees if provided
      if (Array.isArray(examinee_ids) && examinee_ids.length > 0) {
        const rows = examinee_ids.map((user_id) => ({
          schedule_examinee_id: uuidv4(),
          schedule_id: schedule.schedule_id,
          user_id,
        }));

        await ExamScheduleExaminee.bulkCreate(rows, { transaction: t });
      }

      await t.commit();

      const createdSchedule = await ExamSchedule.findOne({
        where: { schedule_id: schedule.schedule_id },
        include: [
          { model: Exam, as: "exam" },
          { model: ExamScheduleExaminee, as: "registeredExaminees" },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Exam schedule created successfully",
        data: createdSchedule,
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("CREATE SCHEDULE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating exam schedule",
        error: error.message,
      });
    }
  },

  // ================================================================
  // GET ALL SCHEDULES
  // ================================================================
  getSchedules: async (req, res) => {
    try {
      const schedules = await ExamSchedule.findAll({
        include: [
          {
            model: Exam,
            as: "exam",
            attributes: ["exam_id", "name", "description"],
          },
          {
            model: ExamScheduleExaminee,
            as: "registeredExaminees",
            include: [{ model: User, as: "user" }],
          },
          {
            model: ExamSectionEvaluation,
            as: "evaluations",
          },
        ],
        order: [["date", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        count: schedules.length,
        data: schedules,
      });
    } catch (error) {
      console.error("GET SCHEDULES ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching schedules",
        error: error.message,
      });
    }
  },

  // ================================================================
  // GET SCHEDULE BY ID
  // ================================================================
  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;

      const schedule = await ExamSchedule.findOne({
        where: { schedule_id: id },
        include: [
          { model: Exam, as: "exam" },
          {
            model: ExamScheduleExaminee,
            as: "registeredExaminees",
            include: [{ model: User, as: "user" }],
          },
          { model: ExamSectionEvaluation, as: "evaluations" },
        ],
      });

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      console.error("GET SCHEDULE BY ID ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching schedule",
        error: error.message,
      });
    }
  },

  // ================================================================
  // UPDATE SCHEDULE
  // ================================================================
  updateSchedule: async (req, res) => {
    const t = await ExamSchedule.sequelize.transaction();
    try {
      const { id } = req.params;
      const { date, start_time, end_time, examinee_ids } = req.body;

      const schedule = await ExamSchedule.findOne({
        where: { schedule_id: id },
        transaction: t,
      });

      if (!schedule) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      // Update schedule info
      await schedule.update(
        {
          date: date || schedule.date,
          start_time: start_time || schedule.start_time,
          end_time: end_time || schedule.end_time,
        },
        { transaction: t }
      );

      // Update examinees if provided
      if (Array.isArray(examinee_ids)) {
        // remove old
        await ExamScheduleExaminee.destroy({
          where: { schedule_id: id },
          transaction: t,
        });

        // insert new
        const rows = examinee_ids.map((user_id) => ({
          schedule_examinee_id: uuidv4(),
          schedule_id: id,
          user_id,
        }));

        await ExamScheduleExaminee.bulkCreate(rows, { transaction: t });
      }

      await t.commit();

      const updatedSchedule = await ExamSchedule.findOne({
        where: { schedule_id: id },
        include: [
          { model: Exam, as: "exam" },
          {
            model: ExamScheduleExaminee,
            as: "registeredExaminees",
            include: [{ model: User, as: "user" }],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("UPDATE SCHEDULE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating exam schedule",
        error: error.message,
      });
    }
  },

  // ================================================================
  // DELETE SCHEDULE (SOFT DELETE)
  // ================================================================
  deleteSchedule: async (req, res) => {
    const t = await ExamSchedule.sequelize.transaction();
    try {
      const { id } = req.params;

      const schedule = await ExamSchedule.findOne({
        where: { schedule_id: id },
        transaction: t,
      });

      if (!schedule) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      await schedule.destroy({ transaction: t }); // default soft delete with paranoid

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Schedule deleted successfully",
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("DELETE SCHEDULE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error deleting schedule",
        error: error.message,
      });
    }
  },
};
