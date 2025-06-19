import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Tour from './models/Tour.js';
import User from './models/User.js';
import Review from './models/Review.js';
import Booking from './models/Booking.js';

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// Tour seed data
const seedTours = [
  {
    title: 'Parisian Dream Tour',
    city: 'Paris',
    address: 'Eiffel Tower, Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    distance: 15,
    photo: 'https://picsum.photos/seed/paris/800/600',
    desc: 'Experience the magic of Paris, from the Eiffel Tower to the Louvre Museum. A journey through art, history, and romance.',
    price: 10120,
    maxGroupSize: 10,
    reviews: [],
    featured: true,
  },
  {
    title: 'Roman Holiday Adventure',
    city: 'Rome',
    address: 'Colosseum, Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    distance: 20,
    photo: 'https://via.placeholder.com/800x600.png?text=Rome+Colosseum',
    desc: 'Explore ancient ruins, majestic fountains, and enjoy delicious Italian cuisine. Rome is a city of endless discovery.',
    price: 10150,
    maxGroupSize: 12,
    reviews: [],
    featured: true,
  },
  {
    title: 'Tokyo Tech & Tradition',
    city: 'Tokyo',
    address: 'Shibuya Crossing, 2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
    distance: 25,
    photo: 'https://picsum.photos/seed/tokyo/800/600',
    desc: 'Dive into the vibrant culture of Tokyo, where ancient temples meet futuristic skyscrapers. A unique blend of old and new.',
    price: 10180,
    maxGroupSize: 8,
    reviews: [],
    featured: false,
  },
  {
    title: 'New York City Lights',
    city: 'New York',
    address: 'Times Square, Manhattan, NY 10036, USA',
    distance: 10,
    photo: 'https://via.placeholder.com/800x600.png?text=NYC+Times+Square',
    desc: 'Discover the iconic landmarks of NYC, from Times Square to Central Park. The city that never sleeps awaits!',
    price: 10100,
    maxGroupSize: 15,
    reviews: [],
    featured: true,
  },
  {
    title: "London's Royal History",
    city: 'London',
    address: 'Buckingham Palace, London SW1A 1AA, United Kingdom',
    distance: 12,
    photo: 'https://picsum.photos/seed/london/800/600',
    desc: 'Uncover the rich history of London, visiting royal palaces, historic sites, and charming neighborhoods.',
    price: 10110,
    maxGroupSize: 10,
    reviews: [],
    featured: false,
  },
  {
    title: 'Majestic Mountain Trek',
    city: 'Banff',
    address: 'Banff National Park, Alberta, Canada',
    distance: 30,
    photo: 'https://via.placeholder.com/800x600.png?text=Banff+Mountains',
    desc: 'Embark on a breathtaking trek through the Canadian Rockies. Stunning vistas and pristine nature.',
    price: 10200,
    maxGroupSize: 6,
    reviews: [],
    featured: true,
  },
  {
    title: 'Sydney Harbour Adventure',
    city: 'Sydney',
    address: 'Sydney Opera House, Bennelong Point, Sydney NSW 2000, Australia',
    distance: 18,
    photo: 'https://picsum.photos/seed/sydney/800/600',
    desc: 'Explore the beautiful harbor, iconic Opera House, and stunning beaches of Sydney.',
    price: 10130,
    maxGroupSize: 12,
    reviews: [],
    featured: false,
  },
  {
    title: 'Ancient Wonders of Giza',
    city: 'Giza',
    address: 'Giza Pyramids, Al Haram, Giza Governorate, Egypt',
    distance: 8,
    photo: 'https://picsum.photos/seed/giza/800/600',
    desc: 'Step back in time and marvel at the Great Pyramids and the Sphinx. An unforgettable historical journey.',
    price: 10160,
    maxGroupSize: 10,
    featured: true,
  },
];

/**
 * Database seeding function
 */
const seedDB = async () => {
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env file. Make sure it is configured.');
    process.exit(1);
  }
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected for seeding...');

    // First clear the existing data if clearDB flag is set
    if (process.argv.includes('--clear')) {
      console.log('Clearing existing database data...');
      await Promise.all([
        Tour.deleteMany({}),
        User.deleteMany({}),
        Review.deleteMany({}),
        Booking.deleteMany({})
      ]);
      console.log('Database cleared successfully!');
    }

    // Create users first
    const users = [];
    if (process.argv.includes('--with-users')) {
      console.log('Creating users...');
      
      // Create admin user
      const adminPassword = await bcrypt.hash('Admin123!', 12);
      const admin = await User.create({
        username: 'admin',
        email: 'admin@voyageiq.com',
        password: adminPassword,
        role: 'admin'
      });
      users.push(admin);
      
      // Create regular users
      for (let i = 1; i <= 5; i++) {
        const password = await bcrypt.hash(`User${i}123!`, 12);
        const user = await User.create({
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: password,
          role: 'user'
        });
        users.push(user);
      }
      
      console.log(`Created ${users.length} users successfully!`);
    }
    
    // Create tours with user references if users were created
    console.log('Creating tours...');
    const createdTours = [];
    
    for (const tour of seedTours) {
      // Assign a random user as creator if users were created
      if (users.length > 0) {
        const randomUserIndex = Math.floor(Math.random() * users.length);
        tour.createdBy = users[randomUserIndex]._id;
      }
      
      const createdTour = await Tour.create(tour);
      createdTours.push(createdTour);
    }
    
    console.log(`Created ${createdTours.length} tours successfully!`);
    
    // Create reviews if specified
    if (process.argv.includes('--with-reviews') && users.length > 0) {
      console.log('Creating reviews...');
      const reviews = [];
      
      for (const tour of createdTours) {
        // Create 1-3 reviews per tour
        const reviewCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < reviewCount; i++) {
          // Select a random user for each review
          const randomUserIndex = Math.floor(Math.random() * users.length);
          const user = users[randomUserIndex];
          
          // Generate random rating between 3-5
          const rating = Math.floor(Math.random() * 3) + 3;
          
          const review = await Review.create({
            tour: tour._id,
            user: user._id,
            rating: rating,
            text: `This is a great tour! ${tour.title} was amazing. ${rating}/5 stars.`
          });
          
          // Add review to tour
          tour.reviews.push(review._id);
          reviews.push(review);
        }
        
        // Update tour with reviews
        await tour.save();
      }
      
      console.log(`Created ${reviews.length} reviews successfully!`);
    }
    
    // Create bookings if specified
    if (process.argv.includes('--with-bookings') && users.length > 0) {
      console.log('Creating bookings...');
      const bookings = [];
      
      for (const user of users) {
        // Skip admin for bookings
        if (user.role === 'admin') continue;
        
        // Create 1-2 bookings per user
        const bookingCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < bookingCount; i++) {
          // Select a random tour for each booking
          const randomTourIndex = Math.floor(Math.random() * createdTours.length);
          const tour = createdTours[randomTourIndex];
          
          // Generate a future date for the booking
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
          
          const booking = await Booking.create({
            tourId: tour._id,
            userId: user._id,
            userEmail: user.email,
            fullName: user.username,
            guestSize: Math.floor(Math.random() * 5) + 1,
            phone: '123-456-7890',
            bookAt: futureDate.toISOString(),
            status: 'confirmed'
          });
          
          bookings.push(booking);
        }
      }
      
      console.log(`Created ${bookings.length} bookings successfully!`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
    Database Seeder for VoyageIQ
    
    Usage: node seed.js [options]
    
    Options:
      --clear            Clear existing database data before seeding
      --with-users       Create users (including admin)
      --with-reviews     Create reviews for tours
      --with-bookings    Create bookings for users
      --help, -h         Show this help message
      
    Examples:
      node seed.js                     // Only seed tours
      node seed.js --clear             // Clear DB and seed tours
      node seed.js --with-users        // Seed tours and users
      node seed.js --clear --with-users --with-reviews --with-bookings  // Full seed
  `);
  process.exit(0);
}

// Run the seeder
seedDB();
