import PropTypes from 'prop-types';

const ServicesCard = ({ service }) => {
  // Error handling: If service data is missing or not an object, display an error state.
  if (
    !service ||
    typeof service !== 'object' ||
    Object.keys(service).length === 0
  ) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-red-200 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <div className="bg-red-100 text-3xl text-red-500 p-3 mb-4 inline-block rounded-full">
          ⚠️
        </div>
        <h3 className="text-lg font-semibold text-red-700 mb-1">Oops!</h3>
        <p className="text-red-500 text-sm">
          Service data is currently unavailable.
        </p>
      </div>
    );
  }

  // Destructure props with default fallbacks to prevent errors if properties are missing
  const {
    title = 'Service Title', // Default if title is not provided
    description = 'A description for this service will be available soon.', // Default if description is not provided
    icon = <span className="text-slate-300 text-2xl">?</span>, // Default icon
  } = service;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full">
      {/* Icon Section */}
      <div className="flex-shrink-0 mb-5">
        <div
          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white 
                     w-16 h-16 md:w-20 md:h-20 
                     flex items-center justify-center 
                     rounded-full shadow-md 
                     mx-auto md:mx-0" // Center on small screens, left-align on medium+
        >
          <span className="text-3xl md:text-4xl">{icon}</span>
        </div>
      </div>

      {/* Text Content Section */}
      <div className="flex-grow flex flex-col">
        {' '}
        {/* Use flex-col to push description down if title is long */}
        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2 text-center md:text-left">
          {title}
        </h3>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed text-center md:text-left flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
};

// PropTypes for type checking and better development experience
ServicesCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.node, // Icon can be a string, number, or a React element/node
  }),
};

// Optional: Default props if you want to ensure `service` object itself has a default structure
// when the prop is completely omitted. However, the initial check and destructuring defaults
// are generally more robust for handling various states of `service`.
// ServicesCard.defaultProps = {
//   service: {
//     title: "Default Service",
//     description: "Default description.",
//     icon: <span className="text-slate-300 text-2xl">?</span>,
//   },
// };

export default ServicesCard;
