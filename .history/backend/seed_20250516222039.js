import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './models/Tour.js'; // Adjust path as necessary
// import User from './models/User.js'; // Uncomment if you want to associate tours with users

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const seedTours = [
  {
    title: 'Parisian Dream Tour',
    city: 'Paris',
    address:
      'Eiffel Tower, Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    distance: 15, // in km
    photo: 'https://picsum.photos/seed/paris/800/600', // Example from picsum.photos
    desc: 'Experience the magic of Paris, from the Eiffel Tower to the Louvre Museum. A journey through art, history, and romance.',
    price: 10120, // per person
    maxGroupSize: 10,
    reviews: [],
    featured: true,
    // createdBy: userId, // Example: replace userId with an actual ObjectId of a user if using User model
  },
  {
    title: 'Roman Holiday Adventure',
    city: 'Rome',
    address: 'Colosseum, Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    distance: 20,
    photo: 'https://via.placeholder.com/800x600.png?text=Rome+Colosseum', // Example from via.placeholder.com
    desc: 'Explore ancient ruins, majestic fountains, and enjoy delicious Italian cuisine. Rome is a city of endless discovery.',
    price: 10150,
    maxGroupSize: 12,
    reviews: [],
    featured: true,
  },
  {
    title: 'Tokyo Tech & Tradition',
    city: 'Tokyo',
    address:
      'Shibuya Crossing, 2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
    distance: 25,
    photo: 'https://picsum.photos/seed/tokyo/800/600', // Example from picsum.photos
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
    photo: 'https://via.placeholder.com/800x600.png?text=NYC+Times+Square', // Example from via.placeholder.com
    desc: 'Discover the iconic landmarks of NYC, from Times Square to Central Park. The city that never sleeps awaits!',
    price: 10100,
    maxGroupSize: 15,
    reviews: [],
    featured: true,
  },
  {
    title: "London's Royal History", // Apostrophe escaped
    city: 'London',
    address: 'Buckingham Palace, London SW1A 1AA, United Kingdom',
    distance: 12,
    photo: 'https://picsum.photos/seed/london/800/600', // Example from picsum.photos
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
    photo: 'https://via.placeholder.com/800x600.png?text=Banff+Mountains', // Example from via.placeholder.com
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
    photo: 'https://picsum.photos/seed/sydney/800/600', // Example from picsum.photos
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
    photo: 'https://picsum.photos/seed/giza/800/600', // Example from picsum.photos
    desc: 'Step back in time and marvel at the Great Pyramids and the Sphinx. An unforgettable historical journey.',
    price: 10160,
    maxGroupSize: 10,
    featured: true,
  },
];

const seedDB = async () => {
  if (!MONGO_URL) {
    console.error(
      'MONGO_URL not found in .env file. Make sure it is configured.'
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected for seeding...');

    // Clear existing tours (optional, be careful with this in production)
    await Tour.deleteMany({});
    console.log('Existing tours cleared.');

    // // Optional: Find a user to associate as the creator (example)
    // // const User = mongoose.model('User'); // Ensure User model is registered if using this
    // // const adminUser = await User.findOne({ role: 'admin' });
    // // let userId = null;
    // // if (adminUser) {
    // //   userId = adminUser._id;
    // //   console.log(`Found admin user with ID: ${userId} to associate with tours.`);
    // // } else {
    // //   console.warn('No admin user found to associate as tour creator. Tours will be created without a specific createdBy user.');
    // // }

    // // const toursToInsert = seedTours.map(tour => ({
    // //   ...tour,
    // //   createdBy: userId,
    // // }));
    // // await Tour.insertMany(toursToInsert);

    await Tour.insertMany(seedTours); // Use this line if not associating with a user

    console.log('Database seeded successfully with new tours!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();
