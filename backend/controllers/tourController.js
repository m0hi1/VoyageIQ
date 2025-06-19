import Tour from '../models/Tour.js';
import { isValidObjectId } from '../utils/validators.js';

const getSingleTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid tour ID format' });
    }

    const tour = await Tour.findById(tourId).populate('reviews');

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }

    res.status(200).json({
      success: true,
      data: tour,
      message: 'Tour retrieved successfully',
    });
  } catch (error) {
    console.error('Get Single Tour Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getAllTours = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Default to page 0
  const limit = parseInt(req.query.limit) || 12; // Default to 12 items per page
  const skip = page * limit;

  try {
    const tours = await Tour.find({})
      .populate('reviews')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalTours = await Tour.countDocuments({});
    const totalPages = Math.ceil(totalTours / limit);

    if (tours.length === 0) {
      return res.status(200).json({
        // Still 200 OK, but with a specific message
        success: true, // Or false, depending on how you want to define "success" for no results
        count: 0,
        totalTours: 0,
        currentPage: page,
        totalPages: 0,
        data: [],
        message: 'No tours found matching your criteria.',
      });
    }

    res.status(200).json({
      success: true,
      count: tours.length,
      totalTours,
      currentPage: page,
      totalPages,
      data: tours,
      message: 'Tours retrieved successfully',
    });
  } catch (error) {
    console.error('Get All Tours Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getTourBySearch = async (req, res) => {
  try {
    const {
      city,
      distance,
      maxGroupSize,
      featured,
      title,
      search,
      date,
      adults,
      children,
      minPrice,
      maxPrice
    } = req.query;
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const skip = page * limit;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    } else {
      // Original specific field search if generic search term is not provided
      if (city) query.city = { $regex: city, $options: 'i' };
      if (title) query.title = { $regex: title, $options: 'i' };
    }

    // Keep other filters
    if (distance) query.distance = { $lte: parseInt(distance) };
    if (maxGroupSize) query.maxGroupSize = { $gte: parseInt(maxGroupSize) };
    if (featured === 'true' || featured === 'false')
      query.featured = featured === 'true';

    // Add price filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Add group size filtering based on adults and children
    if (adults) {
      const totalPeople = parseInt(adults) + (children ? parseInt(children) : 0);
      query.maxGroupSize = { $gte: totalPeople };
    }

    const tours = await Tour.find(query)
      .populate('reviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTours = await Tour.countDocuments(query);
    const totalPages = Math.ceil(totalTours / limit);

    if (tours.length === 0) {
      return res.status(200).json({
        // Still 200 OK, but with a specific message
        success: true, // Or false, depending on how you want to define "success" for no results
        count: 0,
        totalTours: 0,
        currentPage: page,
        totalPages: 0,
        data: [],
        message: 'No tours found matching your criteria.',
      });
    }

    res.status(200).json({
      success: true,
      count: tours.length,
      totalTours,
      currentPage: page,
      totalPages,
      data: tours,
      message: 'Tours found successfully',
    });
  } catch (error) {
    console.error('Get Tour By Search Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getFeaturedTour = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // Default to 8 featured tours
    const tours = await Tour.find({ featured: true })
      .populate('reviews')
      .limit(limit)
      .sort({ createdAt: -1 }); // Or sort by some other metric like rating

    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
      message: 'Featured tours retrieved successfully',
    });
  } catch (error) {
    console.error('Get Featured Tour Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getTourCount = async (req, res) => {
  try {
    const count = await Tour.countDocuments({});
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Total tour count retrieved',
    });
  } catch (error) {
    console.error('Get Tour Count Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    // Validation is handled by `validateRequest(tourValidator)` middleware
    const newTour = new Tour(req.body);
    await newTour.save();

    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: newTour,
    });
  } catch (error) {
    console.error('Create Tour Error:', error);
    // Handle Mongoose validation errors specifically if needed
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid tour ID format' });
    }

    // Validation of req.body is handled by `validateRequest(tourValidator)` middleware
    const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run schema validators
    }).populate('reviews');

    if (!updatedTour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      data: updatedTour,
    });
  } catch (error) {
    console.error('Update Tour Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid tour ID format' });
    }

    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }

    // Optionally, delete associated reviews if desired (more complex, handle carefully)
    // await Review.deleteMany({ tourId: deletedTour._id });

    res.status(200).json({
      success: true,
      message: 'Tour deleted successfully',
      data: null, // Or return deletedTour._id
    });
  } catch (error) {
    console.error('Delete Tour Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
};
