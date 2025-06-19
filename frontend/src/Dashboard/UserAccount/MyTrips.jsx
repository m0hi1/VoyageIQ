import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import BASE_URL from "../../utils/config";
import { toast } from "react-toastify";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(`${BASE_URL}/trips/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch trips");
        }
        
        setTrips(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError(error.message || "Failed to load trips");
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token]);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete trip");
      }
      
      // Remove the deleted trip from the state
      setTrips((prevTrips) => prevTrips.filter(trip => trip._id !== tripId));
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete trip");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md text-red-800">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="mb-4">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No trips found</h3>
        <p className="text-gray-500 mb-4">You haven&apos;t created any trips yet.</p>
        <Link 
          to="/AiTrip" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Create Your First Trip
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-gray-900">Your Generated Trips</h3>
        <Link 
          to="/AiTrip" 
          className="text-sm font-medium text-primary hover:underline"
        >
          Create New Trip
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {trip.location}
                </h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {trip.budget}
                </span>
              </div>
              
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{trip.noOfDays} Days Trip</span>
              </div>
              
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{trip.noOfTravellers}</span>
              </div>
              
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Created:{" "}
                  {new Date(trip.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/view-trip/${trip._id}`}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteTrip(trip._id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTrips;
