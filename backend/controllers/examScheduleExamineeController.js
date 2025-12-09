// controllers/examScheduleExamineeController.js
const { ExamScheduleExaminee, ExamSchedule, User } = require("../models");

const { v4: uuidv4 } = require("uuid");

module.exports = {
  // ================================================================
  // REGISTER EXAMINEE TO A SCHEDULE
  // ================================================================
  registerExaminee: async (req, res) => {
    const t = await ExamScheduleExaminee.sequelize.transaction();
    try {
      const { schedule_id, examinee_id } = req.body;

      const schedule = await ExamSchedule.findByPk(schedule_id);
      const user = await User.findByPk(examinee_id);

      if (!schedule) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      if (!user) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Examinee not found",
        });
      }

      // Check duplicate registration
      const exists = await ExamScheduleExaminee.findOne({
        where: { schedule_id, examinee_id },
      });

      if (exists) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Examinee already registered for this schedule",
        });
      }

      const reg = await ExamScheduleExaminee.create(
        {
          schedule_examinee_id: uuidv4(),
          schedule_id,
          examinee_id,
          status: "pending",
        },
        { transaction: t }
      );

      await t.commit();

      const result = await ExamScheduleExaminee.findOne({
        where: { schedule_examinee_id: reg.schedule_examinee_id },
        include: [
          { model: ExamSchedule, as: "schedule" },
          { model: User, as: "examinee" },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Examinee registered successfully",
        data: result,
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("REGISTER EXAMINEE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error registering examinee",
        error: error.message,
      });
    }
  },

  // ================================================================
  // GET ALL EXAMINEES FOR A SCHEDULE
  // ================================================================
  getExaminees: async (req, res) => {
    try {
      const { schedule_id } = req.params;

      const examinees = await ExamScheduleExaminee.findAll({
        where: { schedule_id },
        include: [
          { model: User, as: "examinee" },
          { model: ExamSchedule, as: "schedule" },
        ],
      });

      return res.status(200).json({
        success: true,
        count: examinees.length,
        data: examinees,
      });
    } catch (error) {
      console.error("GET EXAMINEES ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching examinees",
        error: error.message,
      });
    }
  },

  // ================================================================
  // UPDATE EXAMINEE STATUS (present, absent, pending, completed)
  // ================================================================
  updateExamineeStatus: async (req, res) => {
    const t = await ExamScheduleExaminee.sequelize.transaction();
    try {
      const { id } = req.params;
      const { status } = req.body;

      const record = await ExamScheduleExaminee.findByPk(id);

      if (!record) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Examinee registration not found",
        });
      }

      await record.update({ status }, { transaction: t });
      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: record,
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("UPDATE EXAMINEE STATUS ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating status",
        error: error.message,
      });
    }
  },

  // ================================================================
  // REMOVE EXAMINEE FROM SCHEDULE
  // ================================================================
  removeExaminee: async (req, res) => {
    const t = await ExamScheduleExaminee.sequelize.transaction();
    try {
      const { id } = req.params;

      const record = await ExamScheduleExaminee.findByPk(id);

      if (!record) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Examinee registration not found",
        });
      }

      await record.destroy({ transaction: t });
      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Examinee removed from schedule",
      });
    } catch (error) {
      if (!t.finished) await t.rollback();
      console.error("REMOVE EXAMINEE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Error removing examinee",
        error: error.message,
      });
    }
  },
};
