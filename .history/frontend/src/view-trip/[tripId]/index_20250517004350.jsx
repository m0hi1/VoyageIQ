import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '../../contexts/AuthContext';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import Places from '../components/Days'; // Assuming 'Days.jsx' exports a component named 'Places'
import BASE_URL from '../../utils/config';

// Enhanced LoadingSpinner component
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
    <svg
      className="animate-spin h-10 w-10 text-blue-600 mb-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
    <p className="text-lg text-gray-700">Loading trip details...</p>
  </div>
);

// Enhanced ErrorDisplay component
const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 sm:p-10 text-center">
    <div className="bg-red-100 p-5 rounded-full mb-6 shadow-md">
      <svg
        className="w-12 h-12 sm:w-16 sm:h-16 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        ></path>
      </svg>
    </div>
    <h2 className="text-xl sm:text-2xl font-semibold text-red-700 mb-3">
      Oops! Something went wrong.
    </h2>
    <p className="text-gray-600 max-w-md">{message}</p>
  </div>
);

// Component for "No trip data available" state
const NoTripDataAvailable = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 sm:p-10 text-center">
    <div className="bg-gray-100 p-5 rounded-full mb-6 shadow-md">
      <svg
        className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
      No Trip Data Found
    </h2>    <p className="text-gray-600 max-w-md">
      We couldn&apos;t find any details for this trip. It might be new or information
      is still being planned.
    </p>
  </div>
);

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user is logged in before accessing trip details
    if (!user || !token) {
      toast.error('Please log in to view trip details');
      navigate('/login');
      return;
    }
    
    if (!tripId) {
      setError('No trip ID provided.');
      setLoading(false);
      setTrip(null);
      setShowContent(false);
      return;
    }    const fetchTripData = async () => {
      setLoading(true);
      setError(null);
      setTrip(null);
      setShowContent(false);

      try {        // Fetch trip data from the backend API
        const response = await fetch(`${BASE_URL}/trips/${tripId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Handle HTTP error responses
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setTrip(data.data);
        } else {
          setError('Trip not found. It might have been deleted or the ID is incorrect.');
        }
      } catch (err) {
        console.error('Error fetching trip data:', err);
        setError(
          err.message ||
            'An unexpected error occurred while fetching trip details.'
        );
        toast.error('Failed to load trip details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, user, token, navigate]);

  useEffect(() => {
    if (!loading && !error && trip) {
      // Delay showing content slightly to allow CSS transition to be visible
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false); // Reset if loading, error, or no trip
    }
  }, [loading, error, trip]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!trip) {
    return <NoTripDataAvailable />;
  }

  // Handle both Firebase and MongoDB data formats
  const tripData = trip.tripData || {};
  
  // If tripData is a string (JSON), parse it
  const parsedTripData = typeof trip.tripData === 'string' ? 
    JSON.parse(trip.tripData) : tripData;

  return (
    <div
      className={`p-6 md:px-12 lg:px-24 xl:px-32 transition-opacity duration-700 ease-in-out ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >      <InfoSection trip={trip} />

      {(parsedTripData.hotels && parsedTripData.hotels.length > 0) ? (
        <Hotels trip={{...trip, tripData: parsedTripData}} />
      ) : (
        <div className="my-8 p-4 sm:p-6 bg-sky-50 border border-sky-200 rounded-lg flex items-start space-x-3 sm:space-x-4 shadow-sm">
          <div className="flex-shrink-0 pt-1">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-sky-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-md sm:text-lg font-semibold text-sky-800">
              Hotel Information
            </h3>
            <p className="text-sm sm:text-base text-sky-700 mt-1">
              No hotel details are currently listed for this trip.
            </p>
          </div>
        </div>
      )}
      <Places trip={{...trip, tripData: parsedTripData}} />
    </div>
  );
}

export default ViewTrip;
