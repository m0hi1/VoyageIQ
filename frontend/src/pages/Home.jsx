import React from "react";
import 'tailwindcss/tailwind.css'; // Ensure this is correctly set up for your project

// Image Assets
import card01 from '../assets/images/tours/Thar Desert Safari.webp';
import card02 from '../assets/images/gallery-05.jpg';
import card03 from '../assets/images/tours/Mohenjo Daro.webp'; // Assuming this is a different image, otherwise use a different one
// import icon01 from "../assets/images/icon01.png"; // Not used in this component directly, assumed used by ServicesList
// import icon02 from "../assets/images/icon02.png"; // Not used
// import icon03 from "../assets/images/icon03.png"; // Not used
import faqImg from '../assets/images/experience.png';

// Shared & Child Components
import SearchBar from '../shared/searchBar/SearchBar';
import ServicesList from '../components/services/ServicesList';
import FeaturedTourList from '../components/featruredTour/FeaturedTourList';
import FaqList from '../components/Faq/FaqList';
import Testimonials from '../components/Testimonials/Testimonials';
import ImagesGallery from '../components/Gallery/Gallery';
import { Link } from 'react-router-dom';
// Note: For a more robust application, consider wrapping sections or the entire page
// with a React Error Boundary component to catch and handle rendering errors gracefully.

const Home = () => {
  return (
    <>
      {/* Hero Section Starts */}
      <div className="min-h-screen bg-cover md:pt-4 px-6 md:px-12 bg-center">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Text Content */}
          <div>
            <div className="my-8">
              <h1 className="text-[33px] font-cursiveFont text-center md:text-[40px] md:text-start font-bold mb-4">
                Craft Your Dream Trip with{' '}
                <span className="text-BaseColor text-[40px] font-cursiveFont">
                  VoyageIQ
                </span>
              </h1>
              {/* Desktop Paragraph */}
              <p className="text-lg leading-8 text-gray-700 hidden md:block">
                VoyageIQ: Unforgettable adventures, seamless planning. Explore
                diverse destinations, find handpicked stays, connect with fellow
                travelers, and forge lasting memories. Your journey starts now!
              </p>
              {/* Mobile Paragraph */}
              <p className="text-sm leading-7 text-gray-600 block md:hidden text-center md:text-start">
                VoyageIQ: Unforgettable adventures, seamless planning. Your
                journey starts now!
              </p>
            </div>
            <div className="flex justify-center items-center mt-6">
              <Link
                to="/AiTrip"
                className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black px-8 py-4 rounded-full shadow-sm shadow-yellow-300 hover:from-yellow-500 hover:to-yellow-600 transition duration-300 font-semibold flex items-center space-x-2"
              >
                <span>Plan Trip With</span>
                <span className="text-blue-600 font-extrabold text-lg">AI</span>
              </Link>
            </div>{' '}
          </div>

          {/* Hero Image Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 min-h-[250px] md:min-h-[350px] py-4 md:py-0">
            <div className="rounded-lg overflow-hidden shadow-lg h-full mt-4 md:mt-8 transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={card01}
                className="object-cover w-full h-full"
                alt="Scenic mountain landscape"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-full transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={card02}
                className="object-cover w-full h-full"
                alt="Beautiful beach destination"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-full mt-4 md:mt-8 transition-transform duration-300 ease-in-out hover:scale-105">
              <img
                src={card03}
                className="object-cover w-full h-full"
                alt="Historic city view"
              />
            </div>
          </div>
        </div>
        <div className="">
          <SearchBar />
        </div>
      </div>
      {/* Hero Section Ends */}
      {/* Services Section Starts */}
      <section className="py-12">
        {/* Use CSS Grid for layout: 1 column on mobile, 3-column base on desktop for 1/3 + 2/3 split */}
        <div className="container mx-auto grid grid-cols-1  items-center gap-8">
          {/* Text content: spans 1 of 3 columns on desktop */}
          <div className="text-center">
            <h2 className="text-[33px] md:text-[40px] font-cursiveFont font-bold mb-4 group">
              Our{' '}
              <span className="text-BaseColor text-[43px] font-cursiveFont transition-opacity duration-300 ease-in-out group-hover:text-opacity-80">
                Premier Services
              </span>
            </h2>
            <p className="para text-base md:text-lg leading-relaxed md:leading-8 text-gray-700">
              Elevate Your Journey: Unrivaled services, tailored to amplify your
              experience.
            </p>
          </div>
          {/* ServicesList: spans 2 of 3 columns on desktop */}
          <div className="md:col-span-2">
            <ServicesList />
          </div>
        </div>
      </section>
      {/* Services Section Ends */}
      {/* Gallery Section Starts */}
      <section className="py-12 md:py-16 text-center px-6 md:px-12 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-[33px] md:text-[40px] font-cursiveFont font-bold mb-4 group">
            Visual{' '}
            <span className="text-BaseColor text-[40px] font-cursiveFont transition-opacity duration-300 ease-in-out group-hover:text-opacity-80">
              Journeys
            </span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed md:leading-8 mb-8 text-gray-700 max-w-2xl mx-auto">
            Explore travel wonders: A vibrant snapshot of VoyageIQ's curated
            adventures.
          </p>
          <ImagesGallery />
        </div>
      </section>
      {/* Gallery Section Ends */}
      {/* Featured Tours Section Starts */}
      <section className="py-12 md:py-16 px-6 md:px-12">
        <div className="container mx-auto text-center">
          <h1 className="text-[33px] md:text-[40px] font-cursiveFont font-bold mb-4 text-BaseColor transition-all duration-300 ease-in-out hover:text-opacity-80 hover:tracking-wide">
            Signature Tours
          </h1>
          <p className="para text-base md:text-lg leading-relaxed md:leading-8 text-gray-700 mb-8 max-w-3xl mx-auto">
            Unforgettable Journeys Await: Discover tours where adventure meets
            the extraordinary.
          </p>
          <FeaturedTourList />
        </div>
      </section>
      {/* Featured Tours Section Ends */}
      {/* Testimonials Section Starts */}
      <section className="py-12 md:py-16 px-6 md:px-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-[33px] md:text-[40px] font-cursiveFont font-bold mb-4 group">
              Traveler{' '}
              <span className="text-BaseColor text-[40px] font-cursiveFont transition-opacity duration-300 ease-in-out group-hover:text-opacity-80">
                Stories
              </span>
            </h1>
            <p className="text-base md:text-lg font-paraFont font-semibold leading-relaxed md:leading-8 mb-8 text-gray-700">
              Real travelers, real stories. Discover their authentic experiences
              with VoyageIQ.
            </p>
          </div>
          {/* If Testimonials component can cause overflow with md:max-h-[550px], 
              consider adding overflow-y-auto to the div below or managing height internally. */}
          <div className="md:max-h-[550px] overflow-hidden md:overflow-y-auto">
            {' '}
            {/* Added overflow-y-auto for better UX if content exceeds max-height */}
            <Testimonials />
          </div>
        </div>
      </section>
      {/* Testimonials Section Ends */}
      {/* FAQ Section Starts */}
      <section className="py-12 md:py-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 hidden md:block">
              <img
                src={faqImg}
                alt="Illustration for FAQ section showing travel experience"
                className="rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl text-BaseColor font-cursiveFont font-bold text-center md:text-start mb-6 transition-all duration-300 ease-in-out hover:text-opacity-80 hover:tracking-tight">
                Got Questions? We've Got Answers.
              </h2>
              <FaqList />
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section Ends */}
    </>
  );
};

export default Home;

