const express = require("express");
const router = express.Router();

const {
  createVehicleCategory,
  getVehicleCategories,
  getVehicleCategoryById,
  updateVehicleCategory,
  deleteVehicleCategory,
  toggleVehicleCategoryStatus,
} = require("../../controllers/vehicles-controllers/vehicleCategoryController");

const {
  validateCreateVehicleCategory,
  validateUpdateVehicleCategory,
} = require("../../validators/vehicles-validators/vehicleCategoryValidator");

/**
 * @swagger
 * tags:
 *   name: VehicleCategories
 *   description: Vehicle category (license type) management
 */

/**
 * @swagger
 * /vehicle-categories:
 *   get:
 *     summary: Get all vehicle categories
 *     tags: [VehicleCategories]
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
 *         description: Search vehicle categories by name
 *     responses:
 *       200:
 *         description: List of vehicle categories
 */
router.get("/", getVehicleCategories);

/**
 * @swagger
 * /vehicle-categories/{id}:
 *   get:
 *     summary: Get vehicle category by ID
 *     tags: [VehicleCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle Category ID
 *     responses:
 *       200:
 *         description: Vehicle category details
 */
router.get("/:id", getVehicleCategoryById);

/**
 * @swagger
 * /vehicle-categories:
 *   post:
 *     summary: Create a new vehicle category
 *     tags: [VehicleCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle category created successfully
 */
router.post("/", validateCreateVehicleCategory, createVehicleCategory);

/**
 * @swagger
 * /vehicle-categories/{id}:
 *   put:
 *     summary: Update a vehicle category
 *     tags: [VehicleCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle Category ID
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
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vehicle category updated successfully
 */
router.put("/:id", validateUpdateVehicleCategory, updateVehicleCategory);

/**
 * @swagger
 * /vehicle-categories/{id}:
 *   delete:
 *     summary: Deactivate a vehicle category
 *     tags: [VehicleCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle Category ID
 *     responses:
 *       200:
 *         description: Vehicle category deactivated successfully
 */
router.delete("/:id", deleteVehicleCategory);

/**
 * @swagger
 * /vehicle-categories/{id}/toggle-status:
 *   patch:
 *     summary: Toggle vehicle category active status
 *     tags: [VehicleCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle Category ID
 *     responses:
 *       200:
 *         description: Vehicle category status updated
 */
router.patch("/:id/toggle-status", toggleVehicleCategoryStatus);

module.exports = router;
