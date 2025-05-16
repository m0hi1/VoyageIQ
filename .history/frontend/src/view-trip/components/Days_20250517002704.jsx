import React from 'react';
import PlaceCard from './PlaceCard';
import { MapPin } from 'lucide-react';

function Places({ trip }) {
  // Get days data - handle both string (MongoDB) and object (Firebase) formats
  const tripData = trip.tripData || {};
  
  // If no days data is available
  if (!tripData || !tripData.days || tripData.days.length === 0) {
    return (
      <div>
        <h2 className="font-bold text-3xl sm:text-4xl text-center mb-8 mt-8 md:mb-12 text-blue-700 tracking-tight">
          <MapPin className="inline-block mr-2 sm:mr-3 mb-1 h-7 w-7 sm:h-8 sm:w-8" />
          Places to Visit
        </h2>
        <div className="my-8 p-6 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
          <p className="text-blue-700 text-lg">No itinerary details available for this trip.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-3xl sm:text-4xl text-center mb-8 mt-8 md:mb-12 text-blue-700 tracking-tight">
        <MapPin className="inline-block mr-2 sm:mr-3 mb-1 h-7 w-7 sm:h-8 sm:w-8" />
        Places to Visit
      </h2>
      {/* days wiz plan */}
      <div>
        {tripData.days.map((item, index) => (
          <div key={index} className="mt-5">
            <h2 className="font-medium text-lg">Day {item.day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {item.places.map((place, index) => (
                <div key={index}>
                  <h2 className="font-medium text-sm text-orange-600">
                    {place.bestTimeToVisit}
                  </h2>
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;
