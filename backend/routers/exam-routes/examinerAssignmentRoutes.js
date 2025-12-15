const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../../controllers/exam-controllers/examinerAssignmentController");

const {
  validateCreateExaminerAssignment,
  validateUpdateExaminerAssignment,
} = require("../../validators/exam-validators/examinerAssignmentValidator");

/**
 * @swagger
 * tags:
 *   name: Examiner Assignments
 *   description: Manage examiner assignments to exam sections
 */

/**
 * @swagger
 * /examiner-assignments:
 *   get:
 *     summary: Get all examiner assignments
 *     tags: [Examiner Assignments]
 *     responses:
 *       200:
 *         description: List of examiner assignments
 */
router.get("/", getAssignments);

/**
 * @swagger
 * /examiner-assignments/{id}:
 *   get:
 *     summary: Get a single examiner assignment by ID
 *     tags: [Examiner Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Examiner assignment details
 */
router.get("/:id", getAssignmentById);

/**
 * @swagger
 * /examiner-assignments:
 *   post:
 *     summary: Create a new examiner assignment
 *     tags: [Examiner Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examiner_id
 *               - section_id
 *             properties:
 *               examiner_id:
 *                 type: string
 *               section_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Examiner assignment created successfully
 */
router.post("/", validateCreateExaminerAssignment, createAssignment);

/**
 * @swagger
 * /examiner-assignments/{id}:
 *   put:
 *     summary: Update an examiner assignment
 *     tags: [Examiner Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examiner_id:
 *                 type: string
 *               section_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Examiner assignment updated successfully
 */
router.put("/:id", validateUpdateExaminerAssignment, updateAssignment);

/**
 * @swagger
 * /examiner-assignments/{id}:
 *   delete:
 *     summary: Delete an examiner assignment
 *     tags: [Examiner Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Examiner assignment deleted successfully
 */
router.delete("/:id", deleteAssignment);

module.exports = router;
