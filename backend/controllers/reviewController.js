import Review from '../models/Review.js';
import Tour from '../models/Tour.js'; // To update tour's review array
import { isValidObjectId } from '../utils/validators.js';

const createReview = async (req, res) => {
  try {
    const { tourId } = req.params; // tourId from route parameter
    const { username, rating, reviewText } = req.body; // review data from request body
    const userId = req.user.id; // Assuming verifyToken middleware adds user to req

    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Tour ID format' });
    }

    // Validate required fields (basic validation, Joi or similar can be used for more complex cases)
    if (!rating || !reviewText) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Rating and review text are required.',
        });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }

    // Check if user already reviewed this tour (optional, based on requirements)
    // const existingReview = await Review.findOne({ tourId, userId });
    // if (existingReview) {
    //   return res.status(400).json({ success: false, message: 'You have already reviewed this tour.' });
    // }

    // Create a new review
    const newReview = new Review({
      tourId,
      userId, // Store the ID of the user who created the review
      username: username || req.user.username, // Use username from token or request body
      rating,
      reviewText,
    });
    await newReview.save();

    // Add review to tour's reviews array
    tour.reviews.push(newReview._id);
    // Optionally, recalculate average rating for the tour here
    await tour.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview,
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id; // reviewId from route parameter
    const userId = req.user.id; // ID of the user making the request
    const userRole = req.user.role; // Role of the user

    if (!isValidObjectId(reviewId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Review ID format' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }

    // Authorization: User can delete their own review, or admin can delete any review
    if (review.userId.toString() !== userId && userRole !== 'admin') {
      return res
        .status(403)
        .json({
          success: false,
          message: 'You are not authorized to delete this review',
        });
    }

    // Find and delete the review
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      // Should not happen if found above, but good practice
      return res
        .status(404)
        .json({ success: false, message: 'Review not found for deletion' });
    }

    // Remove review ID from the corresponding tour's reviews array
    await Tour.findByIdAndUpdate(deletedReview.tourId, {
      $pull: { reviews: deletedReview._id },
    });
    // Optionally, recalculate average rating for the tour here

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: null, // Or return deletedReview._id
    });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

// Get all reviews for a specific tour (optional)
const getReviewsForTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    if (!isValidObjectId(tourId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Tour ID format' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: 'Tour not found' });
    }

    const reviews = await Review.find({ tourId }).populate(
      'userId',
      'username photo'
    ); // Populate user details

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      message: 'Reviews retrieved successfully',
    });
  } catch (error) {
    console.error('Get Reviews for Tour Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
  }
};

export { createReview, deleteReview, getReviewsForTour };
