import express from 'express';
import {
  createReview,
  deleteReview,
  getReviewsForTour,
} from '../controllers/reviewController.js';
import {
  verifyToken,
  verifyUser,
  verifyAdmin,
} from '../middleware/authMiddleware.js'; // Added verifyAdmin for potential future use
// import { isValidObjectId } from '../utils/validators.js'; // isValidObjectId is used in controller

const router = express.Router({ mergeParams: true }); // mergeParams allows access to :tourId if nested under tours

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management for tours
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - tourId
 *         - userId
 *         - username
 *         - rating
 *         - reviewText
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the review
 *         tourId:
 *           type: string
 *           description: ID of the tour being reviewed
 *         userId:
 *           type: string
 *           description: ID of the user who wrote the review
 *         username:
 *           type: string
 *           description: Username of the reviewer (denormalized for convenience)
 *         rating:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given by the user (1-5)
 *         reviewText:
 *           type: string
 *           description: The text content of the review
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d0fe4f5311236168a109cc"
 *         tourId: "60d0fe4f5311236168a109cb"
 *         userId: "60d0fe4f5311236168a109ca"
 *         username: "johndoe"
 *         rating: 5
 *         reviewText: "This tour was amazing!"
 *     ReviewInput:
 *       type: object
 *       required:
 *         - rating
 *         - reviewText
 *         # tourId is usually from path param, userId from token
 *         # username might be from token or req.body if not denormalized from user object
 *       properties:
 *         username: # If allowing user to set username explicitly on review, otherwise it's from req.user
 *           type: string
 *           description: Username of the reviewer
 *         rating:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given by the user (1-5)
 *         reviewText:
 *           type: string
 *           description: The text content of the review
 */

/**
 * @swagger
 * /reviews/{tourId}:
 *   post:
 *     summary: Create a new review for a specific tour
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput' # username might be part of this if not taken from req.user
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request (e.g., validation error, invalid tourId, already reviewed if applicable)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.post('/:tourId', verifyToken, createReview); // Assuming tourId is passed as a param for the review itself

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by its ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully.
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
 *                   example: Review deleted successfully
 *       400:
 *         description: Invalid review ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not the owner of the review or not an admin)
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
// verifyUser middleware should check if the logged-in user is the owner of the review or an admin.
// The `req.params.id` for verifyUser here refers to the review's ID.
router.delete('/:id', verifyToken, verifyUser, deleteReview);

/**
 * @swagger
 * /reviews/tour/{tourId}:
 *   get:
 *     summary: Get all reviews for a specific tour
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tour for which to retrieve reviews
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: A list of reviews for the tour.
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
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid tour ID format
 *       404:
 *         description: Tour not found or no reviews for this tour
 *       500:
 *         description: Internal server error
 */
router.get('/tour/:tourId', getReviewsForTour);

export default router;
