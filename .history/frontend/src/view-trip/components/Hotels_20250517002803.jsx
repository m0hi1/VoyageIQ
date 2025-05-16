import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa'; // Using react-icons for better icons

function Hotels({ trip }) {
  // Access hotels - handle both data formats
  const tripData = trip.tripData || {};
  const hotels = tripData.hotels || [];
  
  if (!hotels || hotels.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800">
          Hotel Recommendations
        </h2>
        <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
          <p className="text-blue-700 text-lg">No hotel recommendations available.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-6 text-gray-800">
        Hotel Recommendations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel, index) => (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${hotel?.hotelName},${hotel?.address}`}
            target="_blank"
            key={index}
            className="block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white"
          >
            <div className="relative">
              <img
                src="/trip-placeholder.webp" // Consider dynamic images if available
                alt={hotel?.hotelName || 'Hotel Image'}
                className="w-full h-48 object-cover" // Ensures image covers the area
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                ⭐ {hotel?.rating}
              </div>
            </div>
            <div className="p-4">
              <h3
                className="text-lg font-semibold text-gray-900 mb-1 truncate"
                title={hotel?.hotelName}
              >
                {hotel?.hotelName}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                <span className="truncate" title={hotel?.address}>
                  {hotel?.address}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaDollarSign className="mr-2 text-green-500" />
                <span>{hotel?.priceRange}</span>
              </div>
              {/* 
              <p className="text-xs text-gray-500 mt-2">{hotel.description}</p> 
              // Uncomment if you have a description and want to show it
              */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
