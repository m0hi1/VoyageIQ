import { useRef, useState } from 'react';
import BASE_URL from '../../utils/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// A simple inline SVG for the search icon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5" // Adjust size as needed
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

// A simple inline SVG for the loading spinner
const LoadingSpinnerIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const SearchTours = () => {
  const cityRef = useRef(null); // Use null for initial ref value for DOM elements
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async event => {
    // Prevent default form submission if called from form's onSubmit
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const searchTerm = cityRef.current?.value.trim() || '';

    if (!searchTerm) {
      toast.error('Please enter a destination or tour name.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/tours/search?search=${encodeURIComponent(searchTerm)}`
      );

      let responseData;
      try {
        // Attempt to parse JSON, as backend might send error details in JSON format
        responseData = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails and response was not OK, it's likely a server error with non-JSON body
        if (!response.ok) {
          toast.error(
            `Search failed: ${
              response.statusText || 'Server error (non-JSON response)'
            }`
          );
          // Navigate to search results page, indicating an error
          navigate(`/tours/search?search=${encodeURIComponent(searchTerm)}`, {
            state: {
              data: [],
              error: `Server error: ${response.statusText}`,
              query: searchTerm,
            },
          });
          setIsLoading(false);
          return;
        }
        // If response was OK but JSON parsing failed, this is unexpected.
        console.error('Failed to parse JSON response:', jsonError);
        toast.error('Received an invalid response from the server.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // Use message from backend if available, otherwise a generic one
        const errorMessage =
          responseData?.message ||
          `Search failed: ${response.statusText || 'Unknown server error'}`;
        toast.error(errorMessage);
        navigate(`/tours/search?search=${encodeURIComponent(searchTerm)}`, {
          state: { data: [], error: errorMessage, query: searchTerm },
        });
      } else {
        // response.ok is true
        if (
          responseData.success &&
          responseData.data &&
          responseData.data.length > 0
        ) {
          toast.success(`Found ${responseData.data.length} tours!`);
          // Pass the actual data array to the state for the results page
          navigate(`/tours/search?search=${encodeURIComponent(searchTerm)}`, {
            state: responseData.data,
          });
        } else {
          // Handle cases where success is true but no data, or success is false with a message
          const noResultsMessage =
            responseData?.message || 'No tours found matching your criteria.';
          toast.info(noResultsMessage);
          navigate(`/tours/search?search=${encodeURIComponent(searchTerm)}`, {
            state: { data: [], message: noResultsMessage, query: searchTerm },
          });
        }
      }
    } catch (error) {
      // Catches network errors or other unexpected issues
      console.error('Search API call failed:', error);
      const networkErrorMessage =
        'An API error occurred. Please check your connection and try again.';
      toast.error(networkErrorMessage);
      // Navigate to search results page, indicating a network/API error
      navigate(`/tours/search?search=${encodeURIComponent(searchTerm)}`, {
        state: { data: [], error: networkErrorMessage, query: searchTerm },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handles Enter key press in the input field
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(); // Call handleSubmit directly
    }
  };

  return (
    // Using a subtle gradient for the background, adjust colors as needed
    <div className="py-10 md:py-16 bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-800 dark:to-stone-900">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 text-gray-800 dark:text-white">
            Explore Your Next <span className="text-BaseColor">Adventure</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto text-base md:text-lg">
            Discover amazing tours and activities. Enter your destination or
            what you're looking for!
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white dark:bg-slate-700 shadow-2xl rounded-xl flex items-center p-1.5 sm:p-2 ring-1 ring-gray-200 dark:ring-slate-600 focus-within:ring-2 focus-within:ring-BaseColor transition-all duration-300"
          >
            <div className="pl-3 pr-2 text-gray-400 dark:text-gray-300">
              <SearchIcon />
            </div>
            <input
              type="search"
              ref={cityRef}
              onKeyPress={handleKeyPress} // Keep for Enter key if not relying solely on form submit
              className="py-3 px-2 bg-transparent w-full focus:outline-none text-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-base"
              placeholder="E.g., 'Paris', 'Mountain Hiking', 'Beach Tour'"
              aria-label="Search for a tour"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              // Assuming BaseColor is defined in your tailwind.config.js, e.g., colors: { BaseColor: '#yourColorCode' }
              // If not, replace bg-BaseColor, hover:bg-BaseColor-darker, focus:ring-BaseColor with actual Tailwind colors like bg-indigo-600
              className={`font-semibold text-white py-2.5 px-4 sm:px-6 text-sm sm:text-base rounded-lg
                          transition-all duration-300 ease-in-out transform 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-700 focus:ring-BaseColor
                          ${
                            isLoading
                              ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed'
                              : 'bg-BaseColor hover:bg-opacity-85 active:scale-95'
                          }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinnerIcon />
                  <span className="ml-2 hidden sm:inline">Searching...</span>
                </span>
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SearchTours;
