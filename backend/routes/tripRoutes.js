import express from 'express';
import {
  createTrip,
  getUserTrips,
  getTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: AI-generated trip management
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - location
 *         - noOfDays
 *         - budget
 *         - noOfTravellers
 *         - tripData
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the trip
 *           example: 60d0fe4f5311236168a109ca
 *         location:
 *           type: string
 *           description: The trip destination
 *           example: Paris, France
 *         noOfDays:
 *           type: number
 *           description: Duration of the trip in days
 *           example: 5
 *         budget:
 *           type: string
 *           description: Budget level for the trip
 *           enum: [Budget, Mid-Range, Luxury]
 *           example: Mid-Range
 *         noOfTravellers:
 *           type: string
 *           description: Type of travel group
 *           example: Solo
 *         tripData:
 *           type: object
 *           description: Complete AI-generated trip data including itinerary
 *         userId:
 *           type: string
 *           description: ID of the user who created this trip
 *           example: 60d0fe4f5311236168a109cb
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the trip was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the trip was last updated
 */

// All trip routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - noOfDays
 *               - budget
 *               - noOfTravellers
 *               - tripData
 *             properties:
 *               location:
 *                 type: string
 *               noOfDays:
 *                 type: number
 *               budget:
 *                 type: string
 *                 enum: [Budget, Mid-Range, Luxury]
 *               noOfTravellers:
 *                 type: string
 *               tripData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Trip created successfully
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
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.post('/', createTrip);

/**
 * @swagger
 * /trips/user:
 *   get:
 *     summary: Get all trips for the current user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's trips
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
 *                     $ref: '#/components/schemas/Trip'
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.get('/user', getUserTrips);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Invalid trip ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user doesn't own this trip)
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getTrip);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid trip ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user doesn't own this trip)
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteTrip);

export default router;
