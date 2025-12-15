const express = require("express");
const router = express.Router();

const {
  createStructureNode,
  getStructureNodes,
  getStructureNodeById,
  updateStructureNode,
  deleteStructureNode,
  toggleStructureNodeActiveStatus,
} = require("../../controllers/structure-controller/structureNodeController");

const {
  validateCreateStructureNode,
  validateUpdateStructureNode,
} = require("../../validators/structure-validators/structureNodeValidator");

/**
 * @swagger
 * tags:
 *   name: StructureNodes
 *   description: Organization structure management
 */

/**
 * @swagger
 * /structure-nodes:
 *   get:
 *     summary: Get all structure nodes
 *     tags: [StructureNodes]
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
 *         description: Search nodes by name
 *     responses:
 *       200:
 *         description: List of structure nodes
 */
router.get("/", getStructureNodes);

/**
 * @swagger
 * /structure-nodes/{id}:
 *   get:
 *     summary: Get structure node by ID
 *     tags: [StructureNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Structure node ID
 *     responses:
 *       200:
 *         description: Structure node details
 */
router.get("/:id", getStructureNodeById);

/**
 * @swagger
 * /structure-nodes:
 *   post:
 *     summary: Create a new structure node
 *     tags: [StructureNodes]
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
 *               parent_id:
 *                 type: string
 *               level:
 *                 type: number
 *     responses:
 *       201:
 *         description: Structure node created successfully
 */
router.post("/", validateCreateStructureNode, createStructureNode);

/**
 * @swagger
 * /structure-nodes/{id}:
 *   put:
 *     summary: Update a structure node
 *     tags: [StructureNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Structure node ID
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
 *               parent_id:
 *                 type: string
 *               level:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Structure node updated successfully
 */
router.put("/:id", validateUpdateStructureNode, updateStructureNode);

/**
 * @swagger
 * /structure-nodes/{id}:
 *   delete:
 *     summary: Deactivate a structure node
 *     tags: [StructureNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Structure node ID
 *     responses:
 *       200:
 *         description: Structure node deactivated successfully
 */
router.delete("/:id", deleteStructureNode);

/**
 * @swagger
 * /structure-nodes/{id}/toggle-status:
 *   patch:
 *     summary: Toggle structure node active status
 *     tags: [StructureNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Structure node ID
 *     responses:
 *       200:
 *         description: Structure node status updated
 */
router.patch("/:id/toggle-status", toggleStructureNodeActiveStatus);

module.exports = router;
