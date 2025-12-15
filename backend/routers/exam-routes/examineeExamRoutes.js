const express = require("express");
const router = express.Router();

const {
  createExamineeExam,
  getExamineeExams,
  getExamineeExamById,
  updateExamineeExam,
  deleteExamineeExam,
  getExamineesBySchedule,
} = require("../../controllers/exam-controllers/examineeExamController");

const {
  validateCreateExamineeExam,
  validateUpdateExamineeExam,
} = require("../../validators/exam-validators/examineeExamValidator");

/**
 * @swagger
 * tags:
 *   name: Examinee Exams
 *   description: Examinee exam management
 */

/**
 * @swagger
 * /examinee-exams:
 *   get:
 *     summary: Get all examinee exams
 *     tags: [Examinee Exams]
 *     responses:
 *       200:
 *         description: List of examinee exams
 */
router.get("/", getExamineeExams);

/**
 * @swagger
 * /examinee-exams/schedule/{id}:
 *   get:
 *     summary: Get examinees assigned to a specific exam schedule
 *     tags: [Examinee Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Exam Schedule ID
 *     responses:
 *       200:
 *         description: List of examinees assigned to the schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       examinee_exam_id:
 *                         type: string
 *                         format: uuid
 *                       total_score:
 *                         type: number
 *                         example: 85
 *                       is_passed:
 *                         type: boolean
 *                         example: true
 *                       examinee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           full_name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       exam:
 *                         type: object
 *                         properties:
 *                           exam_id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.get("/schedule/:id", getExamineesBySchedule);

/**
 * @swagger
 * /examinee-exams/{id}:
 *   get:
 *     summary: Get examinee exam by ID
 *     tags: [Examinee Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee Exam ID
 *     responses:
 *       200:
 *         description: Examinee exam details
 */
router.get("/:id", getExamineeExamById);

/**
 * @swagger
 * /examinee-exams:
 *   post:
 *     summary: Create a new examinee exam
 *     tags: [Examinee Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examinee_id
 *               - exam_id
 *             properties:
 *               examinee_id:
 *                 type: string
 *               exam_id:
 *                 type: string
 *               total_score:
 *                 type: number
 *               is_passed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Examinee exam created successfully
 */
router.post("/", validateCreateExamineeExam, createExamineeExam);

/**
 * @swagger
 * /examinee-exams/{id}:
 *   put:
 *     summary: Update an examinee exam
 *     tags: [Examinee Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_score:
 *                 type: number
 *               is_passed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Examinee exam updated successfully
 */
router.put("/:id", validateUpdateExamineeExam, updateExamineeExam);

/**
 * @swagger
 * /examinee-exams/{id}:
 *   delete:
 *     summary: Delete an examinee exam
 *     tags: [Examinee Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Examinee Exam ID
 *     responses:
 *       200:
 *         description: Examinee exam deleted successfully
 */
router.delete("/:id", deleteExamineeExam);

module.exports = router;
