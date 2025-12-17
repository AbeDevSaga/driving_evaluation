const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActiveStatus,
  resetUserPassword,
  getProfile,
  getUserTypes,
  getExternalUserTypes,
  getUserPositions,
  exportUsers,
} = require("../../controllers/user-controllers/userController");

// Middleware for authentication if needed (example)
// const { authenticate } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /users/types:
 *   get:
 *     summary: Get all user types
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of user types
 */
router.get("/types", getUserTypes);

/**
 * @swagger
 * /users/external_types:
 *   get:
 *     summary: Get all external user types
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of external user types
 */
router.get("/external_types", getExternalUserTypes);

/**
 * @swagger
 * /users/positions:
 *   get:
 *     summary: Get all user positions
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of user positions
 */
router.get("/positions", getUserPositions);

/**
 * @swagger
 * /users/export:
 *   get:
 *     summary: Export users as CSV or Excel
 *     tags: [Users]
 *     description: >
 *       Export users based on filters into CSV or Excel (.xlsx) format.
 *       Query params allow filtering by user type, active status, and search text.
 *     parameters:
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [csv, xlsx]
 *         description: File format to export (default: csv)
 *
 *       - in: query
 *         name: user_type_id
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter users by user type ID
 *
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter users by active status
 *
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search users by name, email, or phone number
 *
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request
 *       404:
 *         description: No users found for export
 *       500:
 *         description: Server error while generating export
 */

router.get("/export", exportUsers);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: user_type_id
 *         schema:
 *           type: string
 *         description: Filter by user type
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone number
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current logged in user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile
 */
router.get("/profile/me", getProfile);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - user_type_id
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               user_type_id:
 *                 type: string
 *               role_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/", createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               user_type_id:
 *                 type: string
 *               role_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.delete("/:id", deleteUser);

/**
 * @swagger
 * /users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Status updated
 */
router.patch("/:id/toggle-status", toggleUserActiveStatus);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post("/:id/reset-password", resetUserPassword);
module.exports = router;
