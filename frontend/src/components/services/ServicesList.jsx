import ServicesCard from './ServicesCard';
import { MdHotel } from 'react-icons/md';
import { FaPlaneDeparture, FaRoute } from 'react-icons/fa'; // FaRoute for Adventure Tours
import { BsRobot } from 'react-icons/bs'; // Icon for AI Planner

const ServicesList = () => {
  const services = [
    {
      id: 's1',
      title: 'Thrilling Adventure Tours',
      description:
        'Embark on unforgettable journeys with our expertly curated adventure tours. Discover hidden gems and breathtaking landscapes.',
      // Icon styling assumes ServicesCard might have a 'group' class for hover effects
      icon: <FaRoute size={35} className="transition-colors duration-300" />,
    },
    {
      id: 's2',
      title: 'Seamless Travel Planning',
      description:
        'Relax and let us craft your perfect itinerary. From flights to activities, we handle every detail for a stress-free vacation.',
      icon: (
        <FaPlaneDeparture
          size={35}
          className=" transition-colors duration-300"
        />
      ),
    },
    {
      id: 's3',
      title: 'Luxury Accommodations',
      description:
        'Indulge in comfort and style. We partner with top-rated hotels and resorts to ensure a premium stay.',
      icon: <MdHotel size={35} className="transition-colors duration-300" />,
    },
    {
      id: 's4',
      title: 'AI-Powered Itinerary Planner',
      description:
        'Leverage our cutting-edge AI to generate personalized travel plans in minutes. Smart, fast, and tailored to your preferences.',
      icon: <BsRobot size={35} className="transition-colors duration-300" />,
    },
  ];

  // Basic error handling: If no services are defined (e.g., data fetching failed or empty)
  if (!services || services.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Our Services
          </h2>
          <p className="text-lg text-gray-600">
            No services are currently available. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-slate-50">
      {' '}
      {/* Section wrapper with padding and light background */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            Explore Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tailored experiences designed to make your travel unforgettable.
            From AI-powered planning to luxury stays.
          </p>
        </div>

        {/* Responsive grid for service cards. Adjusted to lg:grid-cols-4 for four items. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map(service => (
            <ServicesCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
