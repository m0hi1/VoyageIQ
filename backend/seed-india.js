import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './models/Tour.js';

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// Indian Popular Destinations Tour Data
const indianTours = [
  {
    title: 'Taj Mahal & Agra Heritage Tour',
    city: 'Agra',
    address: 'Taj Mahal, Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India',
    distance: 5,
    photo: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    desc: 'Experience the symbol of eternal love, the magnificent Taj Mahal. This UNESCO World Heritage site showcases the finest Mughal architecture. Visit at sunrise or sunset for the most breathtaking views.',
    price: 8500,
    maxGroupSize: 15,
    reviews: [],
    featured: true,
  },
  {
    title: 'Jaipur Pink City Royal Experience',
    city: 'Jaipur',
    address: 'City Palace, Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002, India',
    distance: 12,
    photo: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop',
    desc: 'Explore the Pink City\'s magnificent forts, palaces, and vibrant bazaars. Visit Amber Fort, Hawa Mahal, and City Palace. Experience royal Rajasthani culture and cuisine.',
    price: 7800,
    maxGroupSize: 12,
    reviews: [],
    featured: true,
  },
  {
    title: 'Kerala Backwaters Houseboat Adventure',
    city: 'Alleppey',
    address: 'Vembanad Lake, Alleppey, Kerala 688001, India',
    distance: 20,
    photo: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
    desc: 'Cruise through the serene backwaters of Kerala on traditional houseboats. Experience the tranquil beauty of coconut groves, paddy fields, and local village life.',
    price: 9200,
    maxGroupSize: 8,
    reviews: [],
    featured: true,
  },
  {
    title: 'Goa Beach Paradise & Heritage Tour',
    city: 'Goa',
    address: 'Calangute Beach, Calangute, Goa 403516, India',
    distance: 8,
    photo: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
    desc: 'Enjoy pristine beaches, water sports, and Portuguese colonial architecture. Visit Old Goa churches, relax on golden beaches, and experience vibrant nightlife.',
    price: 6800,
    maxGroupSize: 10,
    reviews: [],
    featured: true,
  },
  {
    title: 'Leh-Ladakh High Altitude Adventure',
    city: 'Leh',
    address: 'Pangong Tso Lake, Leh-Ladakh, Jammu and Kashmir 194101, India',
    distance: 45,
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    desc: 'Experience the breathtaking landscapes of Ladakh. Visit Pangong Lake, ancient monasteries, and traverse high-altitude mountain passes. Perfect for adventure enthusiasts.',
    price: 15000,
    maxGroupSize: 6,
    reviews: [],
    featured: true,
  },
  {
    title: 'Varanasi Spiritual Journey',
    city: 'Varanasi',
    address: 'Dashashwamedh Ghat, Godowlia, Varanasi, Uttar Pradesh 221001, India',
    distance: 3,
    photo: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop',
    desc: 'Witness the spiritual heart of India at the holy city of Varanasi. Experience Ganga Aarti, explore ancient temples, and discover the city\'s rich cultural heritage.',
    price: 5500,
    maxGroupSize: 12,
    reviews: [],
    featured: false,
  },
  {
    title: 'Udaipur City of Lakes Romance',
    city: 'Udaipur',
    address: 'Lake Pichola, City Palace, Udaipur, Rajasthan 313001, India',
    distance: 15,
    photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    desc: 'Discover the romantic city of lakes with magnificent palaces, serene lakes, and stunning architecture. Visit City Palace, take boat rides on Lake Pichola.',
    price: 8800,
    maxGroupSize: 10,
    reviews: [],
    featured: false,
  },
  {
    title: 'Mumbai Bollywood & Heritage Experience',
    city: 'Mumbai',
    address: 'Gateway of India, Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India',
    distance: 25,
    photo: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    desc: 'Explore India\'s financial capital and Bollywood hub. Visit iconic landmarks, experience street food, and discover the contrasts of this vibrant metropolis.',
    price: 7200,
    maxGroupSize: 14,
    reviews: [],
    featured: false,
  },
];

/**
 * Update all tours to Indian destinations
 */
const updateToIndianTours = async () => {
  if (!MONGO_URL) {
    console.error('MONGO_URL not found in .env file. Make sure it is configured.');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected for updating tours to Indian destinations...');

    // Clear existing tours
    console.log('Clearing existing tours...');
    await Tour.deleteMany({});
    console.log('Existing tours cleared successfully!');

    // Create new Indian tours
    console.log('Creating Indian destination tours...');
    const createdTours = [];

    for (const tour of indianTours) {
      const createdTour = await Tour.create(tour);
      createdTours.push(createdTour);
      console.log(`✓ Created tour: ${tour.title} in ${tour.city}`);
    }

    console.log(`\n🎉 Successfully created ${createdTours.length} Indian destination tours!`);

    // Display summary
    console.log('\n📍 Tours created for the following Indian destinations:');
    createdTours.forEach((tour, index) => {
      console.log(`${index + 1}. ${tour.title} - ${tour.city} (₹${tour.price})`);
    });

  } catch (error) {
    console.error('❌ Error updating tours to Indian destinations:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 MongoDB connection closed.');
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
    Indian Tours Database Updater for VoyageIQ
    
    Usage: node seed-india.js [options]
    
    This script will:
    1. Clear all existing tours from the database
    2. Replace them with popular Indian destination tours
    
    Options:
      --help, -h         Show this help message
      
    Example:
      node seed-india.js     // Update all tours to Indian destinations
  `);
  process.exit(0);
}

// Run the updater
updateToIndianTours();
