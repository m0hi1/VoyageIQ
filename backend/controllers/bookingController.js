import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js'; // To validate tour existence and get details
import { isValidObjectId } from '../utils/validators.js';

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming verifyToken middleware adds user to req
    const {
      tourId,
      fullName,
      tourName,
      totalPrice,
      maxGroupSize,
      phone,
      date,
      guestSize,
    } = req.body;

    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Tour ID format' });
    }

    // Basic validation
    if (
      !tourId ||
      !fullName ||
      !tourName ||
      !totalPrice ||
      !maxGroupSize ||
      !phone ||
      !date ||
      !guestSize
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'All booking fields are required.' });
    }
    if (parseInt(guestSize) > parseInt(maxGroupSize)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Group size exceeds maximum allowed for this tour.',
        });
    }

    // Check if the tour exists (optional, but good practice)
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }
    // You might want to verify if tourName and totalPrice match the tour details from DB

    const newBooking = new Booking({
      userId,
      tourId, // Store tourId for reference
      fullName,
      tourName, // Can be from req.body or fetched from Tour model
      totalPrice,
      maxGroupSize, // Can be from req.body or fetched from Tour model
      guestSize,
      phone,
      date, // Ensure date format is consistent or validated
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Get a specific booking by ID
const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!isValidObjectId(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findById(bookingId).populate(
      'tourId',
      'title city photo'
    ); // Populate some tour details

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Authorization: User can see their own booking, or admin can see any booking
    if (booking.userId.toString() !== userId && userRole !== 'admin') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'You are not authorized to view this booking.',
        });
    }

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking retrieved successfully',
    });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Get all bookings (for admin or for a specific user)
const getAllBookings = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const skip = page * limit;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query = {};
    // If user is not admin, only fetch their bookings
    if (userRole !== 'admin') {
      query.userId = userId;
    }

    const bookings = await Booking.find(query)
      .populate('tourId', 'title city') // Populate tour details
      .populate('userId', 'username email') // Populate user details (for admin)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      success: true,
      count: bookings.length,
      totalBookings,
      currentPage: page,
      totalPages,
      data: bookings,
      message: 'Bookings retrieved successfully',
    });
  } catch (error) {
    console.error('Get All Bookings Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Delete a booking by ID
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!isValidObjectId(bookingId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid booking ID format' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Authorization: User can delete their own booking, or admin can delete any booking
    if (booking.userId.toString() !== userId && userRole !== 'admin') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'You are not authorized to delete this booking.',
        });
    }

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    // This check is somewhat redundant if the above findById succeeded, but good for safety.
    if (!deletedBooking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found for deletion' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: null, // Or return deletedBooking._id
    });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

export { createBooking, getBooking, getAllBookings, deleteBooking };
