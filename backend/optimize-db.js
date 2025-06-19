/**
 * Database Optimization Script
 * Creates indexes to improve query performance
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './models/Tour.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Booking from './models/Booking.js';

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const optimizeDB = async () => {
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env file. Make sure it is configured.');
    process.exit(1);
  }
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected for index optimization...');

    // Create indexes for User collection
    console.log('Creating User indexes...');
    await User.collection.createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
      { key: { role: 1 } }
    ]);
    
    // Create indexes for Tour collection
    console.log('Creating Tour indexes...');
    await Tour.collection.createIndexes([
      { key: { city: 1 } },
      { key: { price: 1 } },
      { key: { featured: 1 } },
      { key: { title: 'text', desc: 'text', city: 'text' } }  // Text search index
    ]);
    
    // Create indexes for Review collection
    console.log('Creating Review indexes...');
    await Review.collection.createIndexes([
      { key: { tour: 1 } },
      { key: { user: 1 } },
      { key: { rating: 1 } }
    ]);
    
    // Create indexes for Booking collection
    console.log('Creating Booking indexes...');
    await Booking.collection.createIndexes([
      { key: { tourId: 1 } },
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { bookAt: 1 } }
    ]);
    
    console.log('Database indexes created successfully!');
    
    // List all created indexes
    console.log('\nUser collection indexes:');
    const userIndexes = await User.collection.listIndexes().toArray();
    console.log(userIndexes);
    
    console.log('\nTour collection indexes:');
    const tourIndexes = await Tour.collection.listIndexes().toArray();
    console.log(tourIndexes);
    
    console.log('\nReview collection indexes:');
    const reviewIndexes = await Review.collection.listIndexes().toArray();
    console.log(reviewIndexes);
    
    console.log('\nBooking collection indexes:');
    const bookingIndexes = await Booking.collection.listIndexes().toArray();
    console.log(bookingIndexes);
    
  } catch (error) {
    console.error('Error optimizing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the optimization script
optimizeDB();
