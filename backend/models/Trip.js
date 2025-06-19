import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'A trip must have a location'],
      trim: true,
    },
    noOfDays: {
      type: Number,
      required: [true, 'A trip must have a duration'],
      min: [1, 'Trip duration must be at least 1 day'],
      max: [15, 'Trip duration cannot exceed 15 days']
    },
    budget: {
      type: String,
      required: [true, 'A trip must have a budget level'],
      enum: ['Budget', 'Mid-Range', 'Luxury'],
    },
    noOfTravellers: {
      type: String,
      required: [true, 'A trip must specify number of travelers'],
    },
    tripData: {
      type: Object, // Storing the complete AI-generated trip data
      required: [true, 'Trip data is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A trip must belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Add indexes for better query performance
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ location: 'text' }); // Text index for search functionality

export default mongoose.model("Trip", tripSchema);
