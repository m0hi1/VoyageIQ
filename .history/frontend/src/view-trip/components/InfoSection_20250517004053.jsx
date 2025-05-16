import { Button } from '@/components/ui/button';
// import { GetPlaceDetails } from "@/services/GlobalApi";
// import { useEffect } from 'react'; // Preserving commented-out useEffect and its import
import { IoSend } from 'react-icons/io5';
import { CalendarDays, CircleDollarSign, Users } from 'lucide-react';

// Helper component for individual detail items
function DetailItem({ icon, label, value }) {
  return (
    <div className="group flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-sm transition-colors duration-300 group-hover:bg-slate-200">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{value}</p>
        <p className="text-md sm:text-lg font-semibold text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
          {label}
        </p>
      </div>
    </div>
  );
}

function InfoSection({ trip }) {
  // const GetPlacePhoto = async () => {
  //   const data = {
  //     textQuery: trip?.userSelection?.location,
  //   };
  //   const res = await GetPlaceDetails(data).then((res) => {
  //     console.log(res);
  //   });
  // };

  // useEffect(() => {
  //   trip && GetPlacePhoto();
  // }, [trip]);
  if (!trip) {
    // Enhanced Loading Skeleton
    return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg animate-pulse">
        {/* Image Skeleton */}
        <div className="h-[300px] sm:h-[340px] bg-slate-200 rounded-xl mb-6"></div>

        {/* Header Skeleton (Title & Share Button) */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="h-10 bg-slate-200 rounded w-3/4 sm:w-1/2"></div>{' '}
          {/* Title Skeleton */}
          <div className="h-12 bg-slate-200 rounded-lg w-32 sm:w-28"></div>{' '}
          {/* Share Button Skeleton */}
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          <div className="h-20 bg-slate-200 rounded-lg"></div>
          <div className="h-20 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Handle both Firebase format (userSelection) and MongoDB API format
  const userSelection = trip?.userSelection;
  const location = userSelection?.location || trip?.location;
  const days = userSelection?.noOfDays || trip?.noOfDays;
  const budget = userSelection?.budget || trip?.budget;
  const travelers = userSelection?.noOfTravellers || trip?.noOfTravellers;
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      {/* Image Section */}
      <div className="relative mb-6">
        <img
          className="h-[300px] sm:h-[340px] w-full object-cover rounded-xl border border-slate-200"
          src={userSelection?.photoUrl || '/info_placeholder.jpg'}
          alt={`Image of ${location || 'the destination'}`}
        />
      </div>

      {/* Info Header: Location and Share Button */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 break-words">
          {location || 'Your Amazing Trip'}
        </h1>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 group shrink-0 text-primary border-primary hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out"
          onClick={() => console.log('Share action triggered')} // Placeholder action
        >
          <IoSend className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
          <span className="font-semibold">Share</span>
        </Button>
      </div>      {/* Trip Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DetailItem
          icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
          label={`${days || 'N/A'} Days`}
          value="Duration"
        />
        <DetailItem
          icon={<CircleDollarSign className="h-6 w-6 text-green-600" />}
          label={`${budget || 'N/A'} Budget`}
          value="Est. Cost"
        />
        <DetailItem
          icon={<Users className="h-6 w-6 text-purple-600" />}
          label={`${travelers || 'N/A'} Traveler(s)`}
          value="Group Size"
        />
      </div>
    </div>
  );
}

export default InfoSection;
