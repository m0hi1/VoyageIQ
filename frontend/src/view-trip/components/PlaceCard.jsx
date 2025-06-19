import React from 'react';
import { Link } from 'react-router-dom';

// Icon components (can be moved to a separate file if preferred)
const MapPinIcon = ({
  className = 'w-5 h-5 inline-block mr-1.5 text-indigo-600 align-middle',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001zm.612-1.426a5.873 5.873 0 006.177-5.195 5.873 5.873 0 00-11.745 0 5.873 5.873 0 005.568 5.195zM10 16.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM10 4a3 3 0 100 6 3 3 0 000-6z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = ({
  className = 'w-5 h-5 inline-block mr-1.5 text-gray-500 align-middle',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
      clipRule="evenodd"
    />
  </svg>
);

function PlaceCard({ place }) {
  const travelTimeMinutes = place?.timeToTravelFromPreviousPlaceMin;
  const travelTimeText =
    travelTimeMinutes && travelTimeMinutes > 0
      ? `${travelTimeMinutes} Minute${travelTimeMinutes === 1 ? '' : 's'}`
      : null;

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName || '')}`}
      target="_blank"
      rel="noopener noreferrer" // Added for security with target="_blank"
      className="block" // Make Link a block element to contain the div properly
    >
      <div className="border rounded-xl p-4 mt-2 flex gap-4 hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 transition-all duration-200 ease-in-out cursor-pointer">
        <img
          src={place?.imageUrl || '/info_placeholder.jpg'}
          alt={`Image of ${place?.placeName || 'the location'}`}
          className="h-32 w-32 rounded-lg object-cover flex-shrink-0" // Adjusted size, added object-cover and flex-shrink-0
        />
        <div className="flex flex-col justify-center">
          {' '}
          {/* Optional: if vertical centering of text block is desired */}
          <h5 className="font-semibold text-lg text-gray-800 flex items-center">
            <MapPinIcon />
            {place?.placeName || 'Unnamed Place'}
          </h5>
          <p className="text-sm text-gray-600 mt-1">
            {place?.placeDetails || 'No details available.'}
          </p>
          {travelTimeText && (
            <h6 className="mt-2 text-sm font-medium text-gray-700 flex items-center">
              <ClockIcon />
              Travel Time: {travelTimeText}
            </h6>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
