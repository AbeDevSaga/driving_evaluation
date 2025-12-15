const express = require("express");
const router = express.Router();

const {
  createSchedule,
  getSchedules,
  getScheduleById,
  getSchedulesByExam,
  updateSchedule,
  deleteSchedule,
} = require("../../controllers/exam-controllers/examScheduleController");

const {
  validateCreateExamSchedule,
  validateUpdateExamSchedule,
} = require("../../validators/exam-validators/examScheduleValidator");

/**
 * @swagger
 * tags:
 *   name: Exam Schedules
 *   description: Exam schedule management
 */

/**
 * @swagger
 * /exam-schedules:
 *   get:
 *     summary: Get all exam schedules
 *     tags: [Exam Schedules]
 *     parameters:
 *       - in: query
 *         name: exam_id
 *         schema:
 *           type: string
 *         description: Filter schedules by exam ID
 *     responses:
 *       200:
 *         description: List of exam schedules
 */
router.get("/", getSchedules);

/**
 * @swagger
 * /exam-schedules/{id}:
 *   get:
 *     summary: Get exam schedule by ID
 *     tags: [Exam Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Exam schedule details
 */
router.get("/:id", getScheduleById);

/**
 * @swagger
 * /exam-schedules/exam/{exam_id}:
 *   get:
 *     summary: Get schedules for a specific exam
 *     tags: [Exam Schedules]
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: List of schedules for the exam
 */
router.get("/exam/:exam_id", getSchedulesByExam);

/**
 * @swagger
 * /exam-schedules:
 *   post:
 *     summary: Create a new exam schedule
 *     tags: [Exam Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - exam_date
 *             properties:
 *               exam_id:
 *                 type: string
 *               exam_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exam schedule created successfully
 */
router.post("/", validateCreateExamSchedule, createSchedule);

/**
 * @swagger
 * /exam-schedules/{id}:
 *   put:
 *     summary: Update an exam schedule
 *     tags: [Exam Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exam_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exam schedule updated successfully
 */
router.put("/:id", validateUpdateExamSchedule, updateSchedule);

/**
 * @swagger
 * /exam-schedules/{id}:
 *   delete:
 *     summary: Delete an exam schedule
 *     tags: [Exam Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Exam schedule deleted successfully
 */
router.delete("/:id", deleteSchedule);

module.exports = router;
