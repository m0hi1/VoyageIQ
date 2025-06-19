// bookingModel.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tourId: { // Reference to the booked tour
      type: mongoose.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour.'],
    },
    userId: { // Reference to the user who made the booking
      type: mongoose.Types.ObjectId, // Changed from String to ObjectId
      ref: 'User',
      required: [true, 'Booking must belong to a user.'],
    },
    fullName: { // Full name of the person booking (might be different from user's name)
      type: String,
      required: [true, 'Full name is required for booking.'],
      trim: true,
    },
    tourName: { // Denormalized tour name for quick display
      type: String,
      required: [true, 'Tour name is required.'],
    },
    guestSize: {
      type: Number,
      required: [true, 'Guest size is required.'],
      min: [1, 'Guest size must be at least 1.']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      // Add validation for phone number format if needed
    },
    date: { // Date of the tour/booking
      type: Date, // Changed from String to Date for better querying/sorting
      required: [true, 'Booking date is required.'],
    },
    totalPrice: { // Price paid for the booking
      type: Number,
      required: [true, 'Total price is required.'],
      min: [0, 'Price cannot be negative.']
    },
    // maxGroupSize is a property of the Tour, not usually stored directly on booking
    // unless it's a snapshot of the tour's maxGroupSize at the time of booking.
    // For this schema, we'll assume guestSize is what's important for the booking itself.
    
    // paymentStatus: { // Optional: track payment status
    //   type: String,
    //   enum: ['pending', 'paid', 'failed', 'refunded'],
    //   default: 'pending',
    // },
    // paymentIntentId: { // Optional: for Stripe or other payment gateways
    //   type: String,
    // }
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Index to quickly find bookings by user or by tour
bookingSchema.index({ userId: 1 });
bookingSchema.index({ tourId: 1 });
// bookingSchema.index({ userId: 1, tourId: 1 }); // Compound if needed

export default mongoose.model("Booking", bookingSchema);
