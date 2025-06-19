import mongoose from "mongoose";
// import Tour from './Tour.js'; // Import Tour model for pre-save hook if calculating avg rating

const reviewSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    userId: { // Add userId to know who wrote the review
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    username: { // Denormalized for easier display, or populate from User
      type: String,
      required: [true, 'Review must have a username.'],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text cannot be empty.'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating can be at most 5.'],
      default: 0, // Or remove default if rating is always required on creation
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews: one user per tour
reviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

// Example: Calculate average rating on Tour after a review is saved or deleted
// This is advanced and requires careful handling to avoid race conditions or performance issues.
// reviewSchema.statics.calculateAverageRatings = async function(tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tourId: tourId }
//     },
//     {
//       $group: {
//         _id: '$tourId',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' }
//       }
//     }
//   ]);

//   if (stats.length > 0) {
//     await mongoose.model('Tour').findByIdAndUpdate(tourId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating
//     });
//   } else {
//     await mongoose.model('Tour').findByIdAndUpdate(tourId, { // Reset if no reviews
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5 // Or some default
//     });
//   }
// };

// reviewSchema.post('save', function() {
//   // this points to current review
//   // this.constructor refers to the model (Review)
//   this.constructor.calculateAverageRatings(this.tourId);
// });

// For findByIdAndUpdate and findByIdAndDelete, 'this' is a query, not a document.
// So, we need a pre-hook to get the document.
// reviewSchema.pre(/^findOneAnd/, async function(next) {
//   this.r = await this.findOne(); // Store review document in query object
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function() {
//   // this.r = await this.findOne(); does NOT work here, query has already executed
//   if (this.r) { // If a review was found and updated/deleted
//     await this.r.constructor.calculateAverageRatings(this.r.tourId);
//   }
// });


export default mongoose.model("Review", reviewSchema);
