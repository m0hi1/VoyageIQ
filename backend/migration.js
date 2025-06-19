// Firebase to MongoDB Migration Tool

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Trip from './models/Trip.js';
import User from './models/User.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWPfYUSpj8NXoCJy4BIaLOI0Pg7hgeOhA",
  authDomain: "ai-trip-planner-d4f97.firebaseapp.com",
  projectId: "ai-trip-planner-d4f97",
  storageBucket: "ai-trip-planner-d4f97.firebasestorage.app",
  messagingSenderId: "936341815966",
  appId: "1:936341815966:web:f1fa517ba6d0d7f48d718f",
  measurementId: "G-ZQKWTW7Q4S",
};

// MongoDB connection string
const MONGO_URL = process.env.MONGO_URL;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Fetch all trips from Firebase
async function fetchFirebaseTrips() {
  try {
    console.log('Fetching trips from Firebase Firestore...');
    const tripsCollection = collection(firestore, 'AiTrips');
    const tripSnapshot = await getDocs(tripsCollection);
    
    console.log(`Found ${tripSnapshot.docs.length} trips in Firestore`);
    
    const trips = [];
    tripSnapshot.docs.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });
    
    return trips;
  } catch (error) {
    console.error('Error fetching trips from Firebase:', error);
    return [];
  }
}

// Map Firebase trips to MongoDB structure and save them
async function migrateTripsToMongoDB(firestoreTrips) {
  console.log('Starting migration to MongoDB...');
  let successCount = 0;
  let errorCount = 0;
  
  for (const firestoreTrip of firestoreTrips) {
    try {
      // Find the MongoDB user ID from the email
      const userEmail = firestoreTrip.userEmail;
      const user = await User.findOne({ email: userEmail });
      
      if (!user) {
        console.warn(`No MongoDB user found for email: ${userEmail}`);
        errorCount++;
        continue;
      }
      
      // Extract user selection data from Firestore format
      const userSelection = firestoreTrip.userSelection || {};
      
      // Create MongoDB trip document
      const mongoTrip = new Trip({
        location: userSelection.location || 'Unknown Location',
        noOfDays: parseInt(userSelection.noOfDays) || 1,
        budget: userSelection.budget || 'Budget',
        noOfTravellers: userSelection.noOfTravellers || 'Solo',
        tripData: firestoreTrip.tripData || {},
        userId: user._id,
        createdAt: firestoreTrip.createdAt?.toDate() || new Date()
      });
      
      await mongoTrip.save();
      successCount++;
      console.log(`Migrated trip: ${firestoreTrip.id}`);
    } catch (error) {
      console.error(`Error migrating trip ${firestoreTrip.id}:`, error);
      errorCount++;
    }
  }
  
  console.log('Migration complete!');
  console.log(`Successfully migrated: ${successCount} trips`);
  console.log(`Failed migrations: ${errorCount} trips`);
}

// Main migration function
async function migrateData() {
  try {
    await connectDB();
    const firestoreTrips = await fetchFirebaseTrips();
    
    if (firestoreTrips.length > 0) {
      await migrateTripsToMongoDB(firestoreTrips);
    } else {
      console.log('No trips found in Firestore to migrate.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing connections...');
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run the migration
migrateData();
