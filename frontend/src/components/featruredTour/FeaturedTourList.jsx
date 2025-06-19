import React from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import TourCard from "../../shared/TourCard";

const FeaturedTourList = () => {
  const {
    apiData: featuredToursData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/featured`); // Corrected endpoint

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h4 className="text-xl font-semibold text-gray-700">
          Loading featured tours...
        </h4>
        {/* Optional: Add a spinner or skeleton loader here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h4 className="text-xl font-semibold text-red-600">Error: {error}</h4>
        <p className="text-gray-600">
          Sorry, we couldn't load the featured tours. Please try again later.
        </p>
      </div>
    );
  }

  if (!featuredToursData || featuredToursData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h4 className="text-xl font-semibold text-gray-700">
          No featured tours available at the moment.
        </h4>
        <p className="text-gray-600">Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
        {featuredToursData?.map(tour => (
          <div
            className="transform transition-all duration-300 hover:scale-105"
            key={tour._id}
          >
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTourList;
