import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  adminCreateUser, // Import adminCreateUser
  updateProfile, // Add the new updateProfile controller
  // getCurrentUser, // Optional: if you add a /me route
} from '../controllers/userController.js';

import {
  verifyAdmin,
  verifyToken,
  verifyUser,
} from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *           example: 60d0fe4f5311236168a109ca
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         photo:
 *           type: string
 *           example: "http://example.com/photo.jpg"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         photo:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */

// Optional: Route to get current logged-in user's details
// router.get('/me', verifyToken, getCurrentUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, verifyAdmin, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Detailed information about the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user trying to access another user's details without admin rights)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', verifyToken, verifyUser, getSingleUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput' # Define UserInput schema for updatable fields
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user trying to update another user without admin rights)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, verifyUser, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user trying to delete another user without admin rights)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

/**
 * @swagger
 * /users/admin-create:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput' # Assuming UserInput schema is suitable
 *     responses:
 *       201:
 *         description: User created successfully by admin.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error, user already exists)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Internal server error
 */
router.post('/admin-create', verifyToken, verifyAdmin, adminCreateUser);

/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     summary: Update the current user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username (optional)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email address (optional, not allowed for Google users)
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password (required when changing password)
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (optional, not allowed for Google users)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation error, duplicate username/email)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.patch('/update-profile', verifyToken, updateProfile);

export default router;
