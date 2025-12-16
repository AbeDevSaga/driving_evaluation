const express = require("express");
const router = express.Router();

const {
  createBatch,
  getBatches,
  getBatchesByCategory,
  getBatchById,
  updateBatch,
  deleteBatch,
} = require("../../controllers/vehicles-controllers/batchController");

const {
  validateCreateBatch,
  validateUpdateBatch,
} = require("../../validators/vehicles-validators/batchValidator");

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Batch management
 */

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Get all batches
 *     tags: [Batches]
 *     parameters:
 *       - in: query
 *         name: vehicle_category_id
 *         schema:
 *           type: string
 *         description: Filter batches by vehicle category
 *     responses:
 *       200:
 *         description: List of batches
 */
router.get("/", getBatches);

/**
 * @swagger
 * /batches/{batch_id}:
 *   get:
 *     summary: Get batch by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: batch_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch details
 */
router.get("/:batch_id", getBatchById);

/**
 * @swagger
 * /batches/category/{vehicle_category_id}:
 *   get:
 *     summary: Get batches by vehicle category
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: vehicle_category_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *     responses:
 *       200:
 *         description: List of batches for the vehicle category
 */
router.get("/category/:vehicle_category_id", getBatchesByCategory);

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_category_id
 *               - batch_code
 *               - name
 *               - year
 *             properties:
 *               vehicle_category_id:
 *                 type: string
 *               batch_code:
 *                 type: string
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *     responses:
 *       201:
 *         description: Batch created successfully
 */
router.post("/", validateCreateBatch, createBatch);

/**
 * @swagger
 * /batches/{batch_id}:
 *   put:
 *     summary: Update a batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: batch_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               batch_code:
 *                 type: string
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Batch updated successfully
 */
router.put("/:batch_id", validateUpdateBatch, updateBatch);

/**
 * @swagger
 * /batches/{batch_id}:
 *   delete:
 *     summary: Delete a batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: batch_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Batch ID
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 */
router.delete("/:batch_id", deleteBatch);

module.exports = router;
