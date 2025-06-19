// bookingRoutes.js

import express from 'express';
import {
  createBooking,
  getBooking,
  getAllBookings,
  deleteBooking,
} from '../controllers/bookingController.js';
import { verifyToken, verifyUser, verifyAdmin } from '../middleware/authMiddleware.js'; // verifyAdmin might be used in controller logic for getAllBookings

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management for tours
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - userId
 *         - tourId
 *         - tourName
 *         - fullName
 *         - guestSize
 *         - phone
 *         - date
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the booking
 *         userId:
 *           type: string
 *           description: ID of the user who made the booking
 *         tourId:
 *           type: string
 *           description: ID of the booked tour
 *         tourName:
 *           type: string
 *           description: Name of the booked tour (denormalized)
 *         fullName:
 *           type: string
 *           description: Full name of the person booking
 *         guestSize:
 *           type: integer
 *           description: Number of guests for the booking
 *         phone:
 *           type: string
 *           description: Contact phone number for the booking
 *         date:
 *           type: string
 *           format: date-time # Or just date if time is not relevant
 *           description: Date of the tour/booking
 *         totalPrice:
 *           type: number
 *           description: Total price for the booking
 *         paid:
 *           type: boolean
 *           default: false
 *           description: Payment status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "60d0fe4f5311236168a109cd"
 *         userId: "60d0fe4f5311236168a109ca"
 *         tourId: "60d0fe4f5311236168a109cb"
 *         tourName: "Amazing Mountain Hike"
 *         fullName: "John Doe"
 *         guestSize: 2
 *         phone: "123-456-7890"
 *         date: "2025-07-20T00:00:00.000Z"
 *         totalPrice: 150
 *         paid: true
 *     BookingInput:
 *       type: object
 *       required:
 *         - tourId
 *         - tourName # Or fetch from tourId in controller
 *         - fullName
 *         - guestSize
 *         - phone
 *         - date
 *         - totalPrice # Or calculate in backend
 *         # userId is from token
 *       properties:
 *         tourId:
 *           type: string
 *         tourName:
 *           type: string
 *         fullName:
 *           type: string
 *         guestSize:
 *           type: integer
 *         phone:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time # Or date
 *         totalPrice:
 *           type: number
 *         # maxGroupSize might be relevant for validation, passed from client or fetched from tour
 *         maxGroupSize:
 *           type: integer
 */

// All booking routes require a logged-in user at minimum
router.use(verifyToken);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking for a tour
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingInput'
 *     responses:
 *       201:
 *         description: Booking created successfully.
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
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request (e.g., validation error, tour not available, max group size exceeded)
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       404:
 *         description: Tour not found
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, createBooking); // Added verifyToken

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (Admin gets all, User gets their own)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *           default: 10
 *         description: Number of bookings per page
 *     responses:
 *       200:
 *         description: A list of bookings.
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
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllBookings); // Controller logic handles admin vs user view

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a specific booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Detailed information about the booking.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Invalid booking ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user trying to access another user's booking without admin rights)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', verifyUser, getBooking); // verifyUser ensures user owns booking or is admin

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully.
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
 *                   example: Booking deleted successfully
 *       400:
 *         description: Invalid booking ID format
 *       401:
 *         description: Unauthorized (token missing or invalid)
 *       403:
 *         description: Forbidden (user trying to delete another user's booking without admin rights)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyUser, deleteBooking); // verifyUser ensures user owns booking or is admin

export default router;
