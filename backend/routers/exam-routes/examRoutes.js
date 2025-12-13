const express = require("express");
const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  toggleExamActiveStatus,
} = require("../../controllers/exam-controllers/examController");

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     tags: [Exams]
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search exams by name
 *     responses:
 *       200:
 *         description: List of exams
 */
router.get("/", getExams);

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam details
 */
router.get("/:id", getExamById);

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pass_percentage
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pass_percentage:
 *                 type: number
 *     responses:
 *       201:
 *         description: Exam created successfully
 */
router.post("/", createExam);

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Update an exam
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               pass_percentage:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exam updated successfully
 */
router.put("/:id", updateExam);

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Deactivate an exam
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deactivated successfully
 */
router.delete("/:id", deleteExam);

/**
 * @swagger
 * /exams/{id}/toggle-status:
 *   patch:
 *     summary: Toggle exam active status
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exam status updated
 */
router.patch("/:id/toggle-status", toggleExamActiveStatus);

module.exports = router;
