import React from "react";
import ImagesGallery from "../components/Gallery/Gallery";
// For more complex scenarios, consider implementing an ErrorBoundary component
// at a higher level in your application to catch JavaScript errors in their child component tree.
// Example: import ErrorBoundary from '../components/ErrorBoundary';

const About = () => {
  return (
    // <ErrorBoundary> {/* Uncomment if you have an ErrorBoundary component */}
    <section className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Main container for consistent padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        {/* Gallery Section Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white">
          Our <span className="text-BaseColor">Gallery</span>
        </h1>
        {/* Subtitle/Description */}
        <p className="text-md sm:text-lg leading-relaxed mb-8 md:mb-12 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          "Unveil travel wonders in our gallery, a snapshot of VoyageIQ's
          adventures. Explore breathtaking destinations and cherished moments captured."
        </p>

        {/* 
          The ImagesGallery component is responsible for displaying the images.
          - Ensure it handles its own loading states (e.g., showing a skeleton loader).
          - Implement internal error handling for issues like failed image loads.
          - For performance, if ImagesGallery is a pure component and its props don't change often,
            consider wrapping it with React.memo to prevent unnecessary re-renders.
            e.g., export default React.memo(ImagesGallery);
        */}
        <ImagesGallery />
      </div>
    </section>
    // </ErrorBoundary>
  );
};

export default About;
