import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from '../../utils/config';
import { IoIosPricetags, IoIosSearch } from 'react-icons/io';
import { BsCalendarDate } from 'react-icons/bs';
import { FaPeopleGroup, FaUserGroup } from 'react-icons/fa6';
import './SearchBar.css';

const SearchBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cityRef = useRef(null);
  const dateRef = useRef(null);
  const adultsRef = useRef(null);
  const childrenRef = useRef(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const navigate = useNavigate();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    // ... (rest of the handleSubmit function remains the same for now) ...
    // Ensure all refs are checked
    if (
      !cityRef.current ||
      !dateRef.current ||
      !adultsRef.current ||
      !childrenRef.current ||
      !minPriceRef.current ||
      !maxPriceRef.current
    ) {
      toast.error('Form elements are not available. Please try again.');
      setIsLoading(false);
      return;
    }

    const searchTerm = cityRef.current.value.trim();
    const dateValue = dateRef.current.value;
    const adultsValue = adultsRef.current.value.trim();
    const childrenValue = childrenRef.current.value.trim();
    const minPrice = minPriceRef.current.value.trim();
    const maxPrice = maxPriceRef.current.value.trim();

    if (
      !searchTerm ||
      !dateValue ||
      !adultsValue ||
      // !childrenValue || // Children can be 0, so an empty string might be valid if defaultValue is not set properly
      !minPrice ||
      !maxPrice
    ) {
      toast.error(
        'Please fill in all required fields: Location, Date, Adults, Min Price, and Max Price.'
      );
      setIsLoading(false);
      return;
    }

    const numMinPrice = parseFloat(minPrice);
    const numMaxPrice = parseFloat(maxPrice);
    const numAdults = parseInt(adultsValue, 10);
    const numChildren = childrenValue ? parseInt(childrenValue, 10) : 0; // Default to 0 if empty

    if (isNaN(numMinPrice) || isNaN(numMaxPrice)) {
      toast.error('Price values must be valid numbers.');
      setIsLoading(false);
      return;
    }
    if (numMinPrice < 0 || numMaxPrice < 0) {
      toast.error('Price values cannot be negative.');
      setIsLoading(false);
      return;
    }
    if (numMinPrice > numMaxPrice) {
      toast.error('Minimum price cannot be greater than maximum price.');
      setIsLoading(false);
      return;
    }

    if (isNaN(numAdults) || isNaN(numChildren)) {
      toast.error('Number of adults and children must be valid numbers.');
      setIsLoading(false);
      return;
    }
    if (numAdults < 1) {
      toast.error('At least one adult is required.');
      setIsLoading(false);
      return;
    }
    if (numChildren < 0) {
      toast.error('Number of children cannot be negative.');
      setIsLoading(false);
      return;
    }

    const selectedDate = new Date(dateValue + 'T00:00:00Z'); // Ensure consistent time for comparison
    const today = new Date(getTodayDateString() + 'T00:00:00Z');

    if (selectedDate < today) {
      toast.error('Selected date cannot be in the past.');
      setIsLoading(false);
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        date: dateValue,
        adults: numAdults.toString(),
        children: numChildren.toString(),
        minPrice: numMinPrice.toString(),
        maxPrice: numMaxPrice.toString(),
      });
      const response = await fetch(`${BASE_URL}/tours/search?${queryParams}`);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();

      if (!response.ok) {
        // Try to get error message from JSON if possible
        let errorMessage = `Search failed: ${response.statusText || response.status}`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult?.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, use the default error message
          console.warn('Failed to parse error response as JSON:', parseError);
        }
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      if (!result.data || result.data.length === 0) {
        toast.info(
          'No tours found matching your criteria. Try different options!'
        );
        // navigate('/tours', { state: { data: [] } }); // Optionally navigate to a generic tours page
      } else {
        toast.success(`${result.data.length} tour(s) found!`);
        navigate(`/tours/search-results?${queryParams.toString()}`, {
          state: { data: result.data, query: searchTerm },
        });
      }
    } catch (error) {
      console.error('Search error:', error);

      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred during the search. Please try again.';

      if (error.message.includes('non-JSON response')) {
        errorMessage = 'Server error: Please check if the backend server is running correctly.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Network error: Unable to connect to the server.';
      } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        errorMessage = 'Server returned invalid data. Please try again or contact support.';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClasses =
    'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/70 focus:border-orange-500 outline-none transition-all duration-200 ease-in-out text-base placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:shadow-lg';
  const formGroupContainerClasses = 'flex flex-col gap-1.5 w-full'; // This will be applied to each field's wrapper
  const iconColor = 'text-orange-500';
  const labelClasses = 'block text-sm font-medium text-gray-700';

  return (
    <div className="py-12 mt-10 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="search-bar-wrapper container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-3">
          Find Your Next <span className="text-orange-500">Adventure</span>
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12 lg:mb-16 max-w-2xl text-base sm:text-lg">
          Explore breathtaking destinations, book unique tours, and create
          unforgettable memories. Start your journey with us!
        </p>

        <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10">
          <form
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end"
            onSubmit={handleSubmit}
            aria-label="Search tours form"
          >
            {/* Location Input */}
            <div className={`${formGroupContainerClasses} lg:col-span-3`}>
              <label htmlFor="location-input" className={labelClasses}>
                <FaPeopleGroup
                  size={16}
                  className={`${iconColor} inline mr-2 mb-0.5`}
                />
                Location
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="Where are you going?"
                ref={cityRef}
                className={inputBaseClasses}
                aria-required="true"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>

            {/* Date Input */}
            <div className={`${formGroupContainerClasses} lg:col-span-2`}>
              <label htmlFor="date-input" className={labelClasses}>
                <BsCalendarDate
                  size={16}
                  className={`${iconColor} inline mr-2 mb-0.5`}
                />
                Date
              </label>
              <input
                id="date-input"
                type="date"
                ref={dateRef}
                className={inputBaseClasses}
                aria-required="true"
                disabled={isLoading}
                min={getTodayDateString()}
              />
            </div>

            {/* Guests Inputs */}
            <div
              className={`${formGroupContainerClasses} md:col-span-2 lg:col-span-3`}
            >
              <label className={labelClasses}>
                <FaPeopleGroup
                  size={16}
                  className={`${iconColor} inline mr-2 mb-0.5`}
                />
                Guests
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/2">
                  <input
                    id="adults-input"
                    type="number"
                    placeholder="Adults"
                    ref={adultsRef}
                    className={inputBaseClasses}
                    aria-label="Number of adults"
                    min="1"
                    defaultValue="1"
                    disabled={isLoading}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <input
                    id="children-input"
                    type="number"
                    placeholder="Children"
                    ref={childrenRef}
                    className={inputBaseClasses}
                    aria-label="Number of children"
                    min="0"
                    defaultValue="0"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Price Range Inputs */}
            <div
              className={`${formGroupContainerClasses} md:col-span-2 lg:col-span-4`}
            >
              <label className={labelClasses}>
                <IoIosPricetags
                  size={16}
                  className={`${iconColor} inline mr-2 mb-0.5`}
                />
                Price Range (₹)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-1/2">
                  <input
                    id="min-price-input"
                    type="number"
                    placeholder="Min."
                    ref={minPriceRef}
                    className={inputBaseClasses}
                    aria-label="Minimum price"
                    min="0"
                    step="1"
                    inputMode="numeric" // Changed from decimal for simplicity, adjust if floats needed
                    disabled={isLoading}
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <input
                    id="max-price-input"
                    type="number"
                    placeholder="Max."
                    ref={maxPriceRef}
                    className={inputBaseClasses}
                    aria-label="Maximum price"
                    min="0"
                    step="1"
                    inputMode="numeric" // Changed from decimal
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full md:col-span-2 lg:col-span-12 flex justify-center lg:justify-end pt-3">
              <button
                type="submit"
                className={`bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-8 py-3.5 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out flex items-center justify-center w-full lg:w-auto font-semibold text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-70 disabled:opacity-60 disabled:cursor-not-allowed ${isLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                aria-label="Search tours"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Searching...
                  </>
                ) : (
                  <>
                    <IoIosSearch size={22} className="mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500 mt-8">
          Tip: Use specific locations and adjust price for best results. Happy
          searching!
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
