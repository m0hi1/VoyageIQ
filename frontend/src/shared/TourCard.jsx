import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaImage } from 'react-icons/fa'; // Added FaImage
import PropTypes from 'prop-types';
import CalculateAvg from '../utils/CalculateAvg';
import { useState, useContext } from 'react'; // Added useState & useContext
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const TourCard = ({ tour }) => {
  const { photo, title, city, price, desc, _id, reviews, featured } = tour;
  const [imageError, setImageError] = useState(false); // Added imageError state
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Ensure CalculateAvg receives an array, making it more robust.
  const { avgRating } = CalculateAvg(reviews || []);

  // Improved display logic for rating and review count
  const showDetailedRating =
    typeof avgRating === 'number' && !isNaN(avgRating) && avgRating > 0;
  const ratingText = showDetailedRating ? avgRating.toFixed(1) : 'New';
  // Ensure reviews array exists before accessing its length for reviewCountText
  const reviewCountText =
    showDetailedRating && reviews && reviews.length > 0
      ? ` (${reviews.length})`
      : '';

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle booking click with authentication check
  const handleBookClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.info('Please log in to book tours');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-xl flex flex-col bg-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <div className="relative w-full h-48 flex items-center justify-center bg-gray-200">
        {' '}
        {/* Added container for consistent size */}
        {imageError ? (
          <FaImage className="text-gray-400 text-6xl" /> // Fallback Icon
        ) : (
          <img
            className="w-full h-full object-cover" // Ensure image fills container
            src={photo}
            alt={title}
            onError={handleImageError} // Added onError handler
          />
        )}
        {featured &&
          !imageError && ( // Hide featured badge if image fails
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Featured
            </span>
          )}
      </div>
      <div className="px-6 py-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">{city}</p>
            <div className="flex items-center gap-1 text-sm text-yellow-500">
              <FaStar />
              <span>
                {ratingText}
                {reviewCountText}
              </span>
            </div>
          </div>
          <Link
            to={`/tours/${_id}`}
            className="font-bold text-xl mb-1 text-gray-800 hover:text-blue-600 transition-colors duration-200 block"
            title={title} // Add title attribute for full text on hover
          >
            {title.length > 25 ? title.substring(0, 25) + '...' : title}
          </Link>
          <p className="text-gray-700 text-sm font-light overflow-hidden overflow-ellipsis h-12">
            {/* Adjusted height for description */}
            {desc.length > 90 ? desc.substring(0, 90) + '...' : desc}
          </p>
        </div>
      </div>
      <div className="px-6 pb-4 pt-2 flex items-center justify-between border-t border-gray-200 mt-auto">
        <div>
          <p className="text-xs text-gray-500 mb-0">Starts From</p>
          <p className="text-xl font-bold text-blue-600">₹{price}</p>
        </div>
        <Link
          to={`/tours/${_id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 text-sm"
          onClick={handleBookClick}
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

TourCard.propTypes = {
  tour: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        rating: PropTypes.number, // Assuming reviews have a rating
        // Add other review properties if needed
      })
    ).isRequired,
    featured: PropTypes.bool,
  }).isRequired,
};

export default TourCard;
