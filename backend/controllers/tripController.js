import Trip from '../models/Trip.js';
import { isValidObjectId } from '../utils/validators.js';

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;

    // Create a new trip with user ID
    const newTrip = new Trip({
      ...req.body,
      userId
    });

    // Save to MongoDB
    const savedTrip = await newTrip.save();

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: savedTrip
    });
  } catch (error) {
    console.error('Create Trip Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip',
      error: error.message
    });
  }
};

// Get all trips for the currently logged-in user
export const getUserTrips = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;

    // Find all trips for this user, sorted by most recent
    const trips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    console.error('Get User Trips Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trips',
      error: error.message
    });
  }
};

// Get a single trip by ID
export const getTrip = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid trip ID format'
      });
    }

    // Find the trip
    const trip = await Trip.findById(id);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found'
      });
    }

    // Check if user owns this trip or is admin
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this trip'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Get Trip Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve trip',
      error: error.message
    });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid trip ID format'
      });
    }

    // Find the trip
    const trip = await Trip.findById(id);

    // Check if trip exists
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found'
      });
    }

    // Check if user owns this trip or is admin
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this trip'
      });
    }

    // Delete the trip
    await Trip.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete Trip Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trip',
      error: error.message
    });
  }
};
