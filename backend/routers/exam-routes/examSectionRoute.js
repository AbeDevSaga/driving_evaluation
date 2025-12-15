const express = require("express");
const router = express.Router();

const {
  createSection,
  getSections,
  getSectionById,
  getSectionsByExam,
  updateSection,
  deleteSection,
} = require("../../controllers/exam-controllers/examSectionController");

const {
  validateCreateSection,
  validateUpdateSection,
} = require("../../validators/exam-validators/examSectionValidator");

/**
 * @swagger
 * tags:
 *   name: Exam Sections
 *   description: Exam section management
 */

/**
 * @swagger
 * /exam-sections:
 *   get:
 *     summary: Get all exam sections
 *     tags: [Exam Sections]
 *     responses:
 *       200:
 *         description: List of exam sections
 */
router.get("/", getSections);

/**
 * @swagger
 * /exam-sections/{id}:
 *   get:
 *     summary: Get exam section by ID
 *     tags: [Exam Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *     responses:
 *       200:
 *         description: Exam section details
 */
router.get("/:id", getSectionById);

/**
 * @swagger
 * /exam-sections/exam/{exam_id}:
 *   get:
 *     summary: Get sections for a specific exam
 *     tags: [Exam Sections]
 *     parameters:
 *       - in: path
 *         name: exam_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: List of sections for the exam
 */
router.get("/exam/:exam_id", getSectionsByExam);

/**
 * @swagger
 * /exam-sections:
 *   post:
 *     summary: Create a new exam section
 *     tags: [Exam Sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exam_id
 *               - name
 *               - weight_percentage
 *             properties:
 *               exam_id:
 *                 type: string
 *               name:
 *                 type: string
 *               weight_percentage:
 *                 type: number
 *               max_score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Exam section created successfully
 */
router.post("/", validateCreateSection, createSection);

/**
 * @swagger
 * /exam-sections/{id}:
 *   put:
 *     summary: Update an exam section
 *     tags: [Exam Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               weight_percentage:
 *                 type: number
 *               max_score:
 *                 type: number
 *     responses:
 *       200:
 *         description: Exam section updated successfully
 */
router.put("/:id", validateUpdateSection, updateSection);

/**
 * @swagger
 * /exam-sections/{id}:
 *   delete:
 *     summary: Delete an exam section
 *     tags: [Exam Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section ID
 *     responses:
 *       200:
 *         description: Exam section deleted successfully
 */
router.delete("/:id", deleteSection);

module.exports = router;
