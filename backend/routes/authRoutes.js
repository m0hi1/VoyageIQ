import express from 'express';
import {
  loginUser,
  registerUser,
  forgetPassword,
  logoutUser,
  refreshToken,
  resetPassword,
  googleAuth,
} from '../controllers/authController.js';
import { checkStatus } from '../controllers/statusController.js';
// import { verifyToken } from '../middleware/authMiddleware.js'; // verifyToken is not used directly on these routes in the current setup

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *               photo:
 *                 type: string
 *                 example: "http://example.com/photo.jpg"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     # Add properties of the user object returned, excluding password
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Bad request (e.g., validation error, user already exists)
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=your_jwt_token; HttpOnly; Path=/; Max-Age=86400
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
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     # Add properties of the user object returned, excluding password
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT token (also sent as HttpOnly cookie)
 *       400:
 *         description: Invalid credentials or validation error
 *       401:
 *         description: Unauthorized (e.g. user not found, wrong password)
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=; HttpOnly; Path=/; Max-Age=0
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
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link/token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent (if user exists)
 *       400:
 *         description: Bad request (e.g., email not provided)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error or email sending failed
 */
router.post('/forgot-password', forgetPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Reset password using a token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token, token expired, or validation error
 *       500:
 *         description: Internal server error
 */
router.patch('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Obtain a new access token using a refresh token
 *     tags: [Auth]
 *     description: This endpoint expects the refresh token to be sent, typically in an HttpOnly cookie or request body. The implementation details of refresh token handling (e.g., where it's stored and sent from) should be documented based on the actual `refreshToken` controller logic.
 *     requestBody:
 *       description: May not be needed if refresh token is handled via cookies.
 *       required: false # Or true if refresh token is expected in body
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: # Example if sent in body
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=new_jwt_token; HttpOnly; Path=/; Max-Age=86400
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate or register user with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - googleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@gmail.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               googleId:
 *                 type: string
 *                 example: 109878765432112345678
 *               photoURL:
 *                 type: string
 *                 example: https://lh3.googleusercontent.com/a/photo
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Internal server error
 */
router.post('/google', googleAuth);

/**
 * @swagger
 * /auth/status:
 *   head:
 *     summary: Check if authentication service is available
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication service is operational
 *       500:
 *         description: Authentication service error
 */
router.head('/status', checkStatus);
router.get('/status', checkStatus);

export default router;
