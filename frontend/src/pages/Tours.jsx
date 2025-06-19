import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch'; // Assuming this hook handles loading and error states
import BASE_URL from '../utils/config';
import TourCard from '../shared/TourCard';
import SearchTours from '../components/Search/SearchTours';

// A simple loading spinner component (you can replace this with a more sophisticated one)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

// An error message component
const ErrorDisplay = ({ message }) => (
  <div className="text-center py-10">
    <p className="text-red-500 text-xl">Oops! Something went wrong.</p>
    <p className="text-gray-600">{message}</p>
  </div>
);

const Tours = () => {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Assuming useFetch returns { apiData, loading, error }
  const {
    apiData: tours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours?page=${page}`); // Changed from /tour to /tours
  const { apiData: tourCountData } = useFetch(`${BASE_URL}/tours/count`); // Changed from /tour to /tours

  useEffect(() => {
    if (tourCountData) {
      // Assuming tourCountData is an object like { count: number } or just the number
      const count =
        typeof tourCountData === 'number' ? tourCountData : tourCountData.count;
      if (typeof count === 'number') {
        const pages = Math.ceil(count / 12); // Assuming 12 items per page
        setPageCount(pages);
      }
    }
    // Scroll to top when page changes or tours are loaded
    window.scrollTo(0, 0);
  }, [page, tourCountData]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ErrorDisplay message={error.message || 'Failed to fetch tours.'} />
      </div>
    );
  }

  // Handle no tours found
  if (!tours || tours.length === 0) {
    return (
      <div>
        <SearchTours />
        <section className="min-h-screen py-8 px-6 md:px-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            No Tours Found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or check back later.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchTours />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {tours.map(tour => (
              <div
                key={tour._id}
                className="transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex flex-wrap pagination items-center justify-center mt-12 gap-2 sm:gap-3">
              {/* Previous Button */}
              <button
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white text-blue-600 border border-gray-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {[...Array(pageCount).keys()].map(number => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md border border-gray-300 transition-colors
                    ${
                      page === number
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  {number + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() =>
                  setPage(prev => Math.min(pageCount - 1, prev + 1))
                }
                disabled={page === pageCount - 1}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-white text-blue-600 border border-gray-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tours;
