import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { useLocation, useNavigate } from 'react-router-dom';
import TourCard from '../shared/TourCard';
import SearchTours from '../components/Search/SearchTours'; // Assuming SearchTours is for initiating new searches
// import { SearchIcon } from '@heroicons/react/outline'; // Example, replace with your actual icon import or component

// A simple placeholder for SearchIcon if not imported
const SearchIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// It's a good practice to memoize components that receive props and don't have internal state,
// especially if they are part of a list, to prevent unnecessary re-renders.
// Assuming TourCard is a pure component that only re-renders when its `tour` prop changes.
const MemoizedTourCard = React.memo(TourCard);

const SearchResultList = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize state with data from location.state.
  // Ensure initialDataValue is an array for the 'data' state.
  const routeStateForInitialData = location.state;
  let initialDataValue;

  if (Array.isArray(routeStateForInitialData)) {
    initialDataValue = routeStateForInitialData;
  } else if (
    typeof routeStateForInitialData === 'object' &&
    routeStateForInitialData !== null &&
    Array.isArray(routeStateForInitialData.data)
  ) {
    initialDataValue = routeStateForInitialData.data;
  } else {
    initialDataValue = []; // Default to empty array if state is not in expected format
  }

  const [data, setData] = useState(initialDataValue);
  const [error, setError] = useState(null); // State to hold any potential errors
  // Initialize message state based on location.state, if present
  const [message, setMessage] = useState(() => {
    if (
      typeof routeStateForInitialData === 'object' &&
      routeStateForInitialData !== null &&
      routeStateForInitialData.message
    ) {
      return routeStateForInitialData.message;
    }
    return null;
  });

  useEffect(() => {
    // This effect updates the component's data state when the route's state changes.
    try {
      const routeState = location.state;
      if (routeState === null || routeState === undefined) {
        // No state passed, or explicitly null/undefined
        setMessage('No search results found. Please try a new search.');
        setData([]);
        setError(null);
      } else if (Array.isArray(routeState)) {
        // Direct array of tours (e.g., successful search with results)
        setData(routeState);
        setError(null);
        setMessage(
          routeState.length === 0
            ? 'No tours found matching your criteria.'
            : null
        );
      } else if (typeof routeState === 'object' && routeState !== null) {
        // Object state (e.g., search with no results, or error state)
        setData(Array.isArray(routeState.data) ? routeState.data : []);
        setError(routeState.error || null);
        setMessage(routeState.message || null);

        if (
          !routeState.error &&
          !routeState.message &&
          (!Array.isArray(routeState.data) || routeState.data.length === 0)
        ) {
          setMessage('No tours found matching your criteria.');
        }
      } else {
        // Unexpected state type
        setError('Invalid search result format. Please try again.');
        setData([]);
        setMessage(null);
      }
    } catch (e) {
      // Catch any other unexpected errors during state processing
      console.error('Error processing location state:', e);
      setError(
        'Failed to process search results. Please try refreshing the page.'
      );
      setData([]);
      setMessage(null);
    }
  }, [location.state]); // Re-run effect if location.state changes

  const handleClearResults = () => {
    setData([]);
    setError(null);
    setMessage(null); // Clear message as well
    // To clear the state from history and prevent it from reappearing on back/forward,
    // you can replace the current history entry.
    navigate(location.pathname, { replace: true, state: null });
  };

  const handleShowAllTrips = () => {
    navigate('/tours'); // Navigate to the page showing all tours
  };

  // Memoize the generation of tour elements to avoid re-calculating on every render
  // unless `data` (the dependency) changes.
  const tourElements = useMemo(() => {
    if (error) {
      // If there's an error, it's handled by the error display block below
      return null;
    }

    if (!data || data.length === 0) {
      // If no data and no error, show a message prompting to search or view all tours.
      // This message is now primarily controlled by the `message` state.
      return null; // The message/empty state is handled outside this memoized variable now
    }

    // Map data to TourCard components
    return data.map(
      tour =>
        tour && tour._id ? (
          <div
            key={tour._id}
            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden"
          >
            <MemoizedTourCard tour={tour} />
          </div>
        ) : null // Add a null check for tour or tour._id for robustness
    );
  }, [data, error]); // Removed navigate and handleShowAllTrips as they are not direct deps for rendering tour items

  return (
    // Added a subtle gradient background for a modern feel
    <div className="bg-gradient-to-br from-slate-100 to-sky-100 min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* SearchTours component, perhaps for refining search, styled within a card */}
        <div className="mb-8 md:mb-12 p-6 bg-white shadow-xl rounded-lg">
          <SearchTours />
        </div>

        <div className="flex justify-between items-center mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            Search Results
          </h1>
          {(data.length > 0 || error || message) && ( // Show clear if there's data, an error, or a message
            <button
              onClick={handleClearResults}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-150"
            >
              Clear Results
            </button>
          )}
        </div>

        {/* Display error message if an error occurred */}
        {error && (
          <div
            className="col-span-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow"
            role="alert"
          >
            <p className="font-bold">Oops! Something went wrong.</p>
            <p>
              {typeof error === 'string'
                ? error
                : 'An unexpected error occurred.'}
            </p>
          </div>
        )}

        {/* Display message if no error but a message exists (e.g., "No tours found") */}
        {!error && message && (!data || data.length === 0) && (
          <div className="col-span-full text-center py-10 px-4">
            <SearchIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {message.includes('No search results') ||
              message.includes('No tours found')
                ? 'No Results'
                : 'Information'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {message.includes('We couldn&apos;t find any tours')
                ? "We couldn't find any tours matching your search. Try different keywords or check out all our available trips."
                : message}
            </p>
            <button
              onClick={handleShowAllTrips}
              className="mt-6 px-6 py-2 bg-BaseColor text-white rounded-md hover:bg-opacity-85 transition-colors"
            >
              View All Tours
            </button>
          </div>
        )}

        {/* 
          Responsive grid layout:
          - 1 column on small screens (default)
          - 2 columns on medium screens (md)
          - 3 columns on large screens (lg)
          - 4 columns on extra-large screens (xl)
          Increased gap for better spacing.
        */}
        {!error && data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {tourElements}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResultList;
