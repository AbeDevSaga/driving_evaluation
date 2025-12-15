const express = require("express");
const router = express.Router();

const {
  createSectionResult,
  getSectionResults,
  getSectionResultById,
  updateSectionResult,
  deleteSectionResult,
} = require("../../controllers/exam-controllers/sectionResultController");

const {
  validateCreateSectionResult,
  validateUpdateSectionResult,
} = require("../../validators/exam-validators/sectionResultValidator");

/**
 * @swagger
 * tags:
 *   name: Section Results
 *   description: Section result management
 */

/**
 * @swagger
 * /section-results:
 *   get:
 *     summary: Get all section results
 *     tags: [Section Results]
 *     responses:
 *       200:
 *         description: List of section results
 */
router.get("/", getSectionResults);

/**
 * @swagger
 * /section-results/{id}:
 *   get:
 *     summary: Get section result by ID
 *     tags: [Section Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section result ID
 *     responses:
 *       200:
 *         description: Section result details
 */
router.get("/:id", getSectionResultById);

/**
 * @swagger
 * /section-results:
 *   post:
 *     summary: Create a new section result
 *     tags: [Section Results]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examinee_exam_id
 *               - section_id
 *               - examiner_id
 *               - score
 *             properties:
 *               examinee_exam_id:
 *                 type: string
 *               section_id:
 *                 type: string
 *               examiner_id:
 *                 type: string
 *               score:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Section result created successfully
 */
router.post("/", validateCreateSectionResult, createSectionResult);

/**
 * @swagger
 * /section-results/{id}:
 *   put:
 *     summary: Update a section result
 *     tags: [Section Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section result ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Section result updated successfully
 */
router.put("/:id", validateUpdateSectionResult, updateSectionResult);

/**
 * @swagger
 * /section-results/{id}:
 *   delete:
 *     summary: Delete a section result
 *     tags: [Section Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Section result ID
 *     responses:
 *       200:
 *         description: Section result deleted successfully
 */
router.delete("/:id", deleteSectionResult);

module.exports = router;
