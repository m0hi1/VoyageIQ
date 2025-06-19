import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A tour must have a title'],
      unique: true,
      trim: true,
      maxlength: [100, 'A tour title must have less or equal then 100 characters'],
      minlength: [5, 'A tour title must have more or equal then 5 characters']
    },
    city: {
      type: String,
      required: [true, 'A tour must have a city'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'A tour must have an address'],
      trim: true,
    },
    distance: { // in kilometers or miles
      type: Number,
      required: [true, 'A tour must have a distance'],
      min: [0, 'Distance must be a positive number']
    },
    photo: {
      type: String, // URL to the photo
      required: [true, 'A tour must have a photo'],
    },
    desc: { // description
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'Price must be a positive number']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size'],
      min: [1, 'Maximum group size must be at least 1']
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    // Example of adding average rating - this would typically be calculated
    // ratingsAverage: {
    //   type: Number,
    //   default: 4.5,
    //   min: [1, 'Rating must be above 1.0'],
    //   max: [5, 'Rating must be below 5.0'],
    //   set: val => Math.round(val * 10) / 10 // Rounds to one decimal place
    // },
    // ratingsQuantity: {
    //   type: Number,
    //   default: 0
    // }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // To include virtual properties when sending JSON
    toObject: { virtuals: true }
  }
);

// Indexes for faster querying
tourSchema.index({ price: 1 }); // Single field index
tourSchema.index({ city: 1 });  // Single field index
tourSchema.index({ featured: 1 });
// Compound index example (if you often query by city and price together)
// tourSchema.index({ city: 1, price: 1 });

// Text index for searching (example)
// tourSchema.index({ title: 'text', desc: 'text', city: 'text' });


// Virtual populate for reviews (alternative to manual population in controller)
// tourSchema.virtual('reviewDetails', {
//   ref: 'Review',
//   foreignField: 'tourId',
//   localField: '_id'
// });


export default mongoose.model("Tour", tourSchema);
