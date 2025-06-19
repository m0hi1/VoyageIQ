import express from 'express';
import {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
} from '../controllers/tourController.js';

import { verifyAdmin, verifyToken } from '../middleware/authMiddleware.js';
import { cacheControl } from '../middleware/cacheMiddleware.js';
import { validateRequest, tourValidator } from '../utils/validators.js'; // Import validators

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Tour management and retrieval
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - title
 *         - city
 *         - address
 *         - distance
 *         - photo
 *         - desc
 *         - price
 *         - maxGroupSize
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the tour
 *         title:
 *           type: string
 *           description: Title of the tour
 *         city:
 *           type: string
 *           description: City where the tour is located
 *         address:
 *           type: string
 *           description: Address of the tour starting point
 *         distance:
 *           type: number
 *           description: Distance covered in the tour (e.g., in km)
 *         photo:
 *           type: string
 *           description: URL of the tour's photo
 *         desc:
 *           type: string
 *           description: Detailed description of the tour
 *         price:
 *           type: number
 *           description: Price of the tour per person
 *         maxGroupSize:
 *           type: integer
 *           description: Maximum number of people in a group for this tour
 *         reviews:
 *           type: array
 *           items:
 *             type: string # Assuming review IDs, or could be a $ref to Review schema
 *           description: List of reviews for this tour
 *         avgRating:
 *           type: number
 *           format: float
 *           description: Average rating of the tour
 *           default: 0
 *         featured:
 *           type: boolean
 *           description: Whether the tour is featured
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d0fe4f5311236168a109cb"
 *         title: "Amazing Mountain Hike"
 *         city: "Mountainville"
 *         address: "123 Trailhead Rd"
 *         distance: 10
 *         photo: "/tour-images/mountain.jpg"
 *         desc: "A breathtaking hike through scenic mountains."
 *         price: 75
 *         maxGroupSize: 10
 *         reviews: []
 *         avgRating: 4.5
 *         featured: true
 *     TourInput:
 *       type: object
 *       required:
 *         - title
 *         - city
 *         - address
 *         - distance
 *         - photo
 *         - desc
 *         - price
 *         - maxGroupSize
 *       properties:
 *         title:
 *           type: string
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         distance:
 *           type: number
 *         photo:
 *           type: string
 *         desc:
 *           type: string
 *         price:
 *           type: number
 *         maxGroupSize:
 *           type: integer
 *         featured:
 *           type: boolean
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Retrieve a list of all tours with pagination
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of tours per page
 *     responses:
 *       200:
 *         description: A list of tours.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 totalPages:
 *                    type: integer
 *                 currentPage:
 *                    type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tour'
 *       500:
 *         description: Internal server error
 */
router.get('/', cacheControl(300), getAllTours);

/**
 * @swagger
 * /tours/search:
 *   get:
 *     summary: Search for tours by city, distance, and max group size
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City to search for tours
 *       - in: query
 *         name: distance
 *         schema:
 *           type: number
 *         description: Maximum distance for the tour
 *       - in: query
 *         name: maxGroupSize
 *         schema:
 *           type: integer
 *         description: Maximum group size for the tour
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
 *         description: A list of tours matching the search criteria.
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
 *                     $ref: '#/components/schemas/Tour'
 *       404:
 *         description: No tours found matching criteria
 *       500:
 *         description: Internal server error
 */
router.get('/search', getTourBySearch);

/**
 * @swagger
 * /tours/featured:
 *   get:
 *     summary: Retrieve a list of featured tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8 
 *         description: Maximum number of featured tours to return
 *     responses:
 *       200:
 *         description: A list of featured tours.
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
 *                     $ref: '#/components/schemas/Tour'
 *       500:
 *         description: Internal server error
 */
router.get('/featured', getFeaturedTour);

/**
 * @swagger
 * /tours/count:
 *   get:
 *     summary: Get the total count of tours
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Total number of tours.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: integer
 *                   example: 50
 *       500:
 *         description: Internal server error
 */
router.get('/count', getTourCount);

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get a single tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tour ID
 *     responses:
 *       200:
 *         description: Detailed information about the tour.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Invalid tour ID format
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getSingleTour);

/**
 * @swagger
 * /tours:
 *   post:
 *     summary: Create a new tour (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       201:
 *         description: Tour created successfully.
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
 *                   $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Bad request (e.g., validation error using tourValidator)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  validateRequest(tourValidator),
  createTour
);

/**
 * @swagger
 * /tours/{id}:
 *   put:
 *     summary: Update an existing tour by ID (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tour ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       200:
 *         description: Tour updated successfully.
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
 *                   $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Bad request (e.g., validation error or invalid ID format)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  validateRequest(tourValidator),
  updateTour
);

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Delete a tour by ID (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tour ID
 *     responses:
 *       200:
 *         description: Tour deleted successfully.
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
 *                   example: Tour deleted successfully
 *       400:
 *         description: Invalid tour ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user is not an admin)
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteTour);

export default router;
