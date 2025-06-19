import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import avatar from '../assets/images/avatar.jpg'; // Assuming this is a placeholder
import {
  FaPeopleGroup,
  FaLocationDot,
  FaStar,
  FaMapPin,
  FaCity,
  FaDollarSign,
} from 'react-icons/fa6';
import CalculateAvg from '../utils/CalculateAvg';
import Booking from '../components/Booking/Booking';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch'; // Assuming useFetch returns { apiData, loading, error }
import BASE_URL from '../utils/config';
import { AuthContext } from '../contexts/AuthContext';

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-BaseColor"></div>
  </div>
);
// A simple error message component
const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col justify-center items-center py-20 bg-red-50 rounded-lg max-w-xl mx-auto shadow-md">
    <p className="text-red-600 text-xl font-semibold mb-4">
      Error: {message || 'Something went wrong.'}
    </p>
    <Link
      to="/"
      className="inline-block bg-BaseColor hover:bg-BHoverColor text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
    >
      Go Back Home
    </Link>
  </div>
);

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

// Hardcoded reviews data as a fallback
const hardcodedReviewsData = [
  {
    _id: 'hc_review_1',
    username: 'Alex Wanderer',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Example avatar
    rating: 5,
    reviewText:
      'Absolutely fantastic tour! The sights were breathtaking and our guide was incredibly knowledgeable and engaging. Highly recommend!',
    createdAt: new Date('2023-09-10T08:30:00Z').toISOString(),
  },
  {
    _id: 'hc_review_2',
    username: 'Maria Explorer',
    rating: 4,
    reviewText:
      'A wonderful experience overall. The itinerary was well-paced, and we saw so much. Deducting one star as lunch could have been better.',
    createdAt: new Date('2023-09-12T14:15:00Z').toISOString(),
  },
  {
    _id: 'hc_review_3',
    username: 'Sam Globetrotter',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg', // Example avatar
    rating: 5,
    reviewText:
      'This was the highlight of my trip! Everything was perfectly organized. The small group size made it very personal.',
    createdAt: new Date('2023-09-15T10:00:00Z').toISOString(),
  },
];

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const reviewMsgRef = useRef(null);

  const [tourData, setTourData] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    apiData: fetchedTour,
    loading: isLoadingTour,
    error: fetchError,
  } = useFetch(`${BASE_URL}/tours/${id}`);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (fetchedTour) {
      const reviewsToDisplay =
        fetchedTour.reviews && fetchedTour.reviews.length > 0
          ? fetchedTour.reviews
          : hardcodedReviewsData;

      setTourData({
        ...fetchedTour,
        reviews: reviewsToDisplay,
      });
    }
  }, [fetchedTour]);

  const {
    title = 'Tour Title',
    photo = '',
    desc = 'No description available.',
    price = 0,
    reviews = [],
    city = 'Unknown City',
    distance = 'N/A',
    maxGroupSize = 'N/A',
    address = 'No address provided.',
  } = tourData || {};

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const { avgRating } = CalculateAvg(reviewsArray);

  const dateDisplayOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit a review.');
      return;
    }
    if (selectedRating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    const reviewText = reviewMsgRef.current.value.trim();
    if (!reviewText) {
      toast.error('Please write your review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewPayload = {
        username: user.username,
        reviewText,
        rating: selectedRating,
      };

      const response = await fetch(`${BASE_URL}/review/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Review submitted successfully!');
        const newReview = result.data;
        if (newReview && tourData) {
          setTourData(prev => ({
            ...prev,
            reviews: Array.isArray(prev.reviews)
              ? [...prev.reviews, newReview]
              : [newReview],
          }));
        }
        reviewMsgRef.current.value = '';
        setSelectedRating(0);
        setHoverRating(0);
      } else {
        toast.error(result.message || 'Failed to submit review.');
      }
    } catch (err) {
      toast.error('Server not responding. Please try again later.');
      console.error('Review submission error:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoadingTour) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return (
      <ErrorDisplay
        message={fetchError.message || 'Failed to load tour details.'}
      />
    );
  }

  if (!tourData) {
    return (
      <ErrorDisplay
        message="Tour not found."
      />
    );
  }

  return (
    <section className="my-6 px-4 sm:px-10 md:px-16 w-full bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Tour Image and Details */}
          <div className="lg:w-2/3">
            {photo && (
              <div className="rounded-lg overflow-hidden shadow-xl mb-10 max-h-[520px] border border-gray-300">
                <img
                  src={photo}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 space-y-8">
              <h2 className="text-4xl font-extrabold text-BaseColor mb-6 tracking-wide">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-gray-700 text-lg font-medium">
                <span className="flex items-center gap-3">
                  <FaStar className="text-yellow-500 text-xl" />
                  {reviewsArray.length > 0
                    ? `${avgRating.toFixed(1)} (${reviewsArray.length} reviews)`
                    : 'No reviews yet'}
                </span>
                <span className="flex items-center gap-3">
                  <FaMapPin className="text-BaseColor text-xl" /> {address}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-gray-700 pt-6 border-t border-gray-300">
                <InfoItem icon={<FaCity />} label="City" value={city} />
                <InfoItem
                  icon={<FaLocationDot />}
                  label="Distance"
                  value={`${distance} km`}
                />
                <InfoItem
                  icon={<FaDollarSign />}
                  label="Price"
                  value={`Rs. ${price} / person`}
                />
                <InfoItem
                  icon={<FaPeopleGroup />}
                  label="Max Group Size"
                  value={`${maxGroupSize} people`}
                />
              </div>
              <div className="pt-6 border-t border-gray-300">
                <h3 className="text-3xl font-semibold mb-4 text-gray-900 tracking-wide">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{desc}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-wide">
                Reviews ({reviewsArray.length})
              </h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="mb-10">
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">
                      Your Rating:
                    </h4>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-3xl transition-colors duration-200 ease-in-out ${
                            star <= (hoverRating || selectedRating)
                              ? 'text-yellow-500'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${star} star`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedRating(star);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <textarea
                      ref={reviewMsgRef}
                      placeholder="Share your thoughts about this tour..."
                      className="w-full flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow text-lg resize-none min-h-[100px]"
                      rows="4"
                      disabled={isSubmittingReview}
                      aria-label="Write your review"
                    />
                    <button
                      type="submit"
                      className="bg-BaseColor hover:bg-BHoverColor text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap self-center sm:self-auto"
                      disabled={isSubmittingReview}
                      aria-live="polite"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mb-10 text-gray-700 text-lg">
                  Please{' '}
                  <Link to="/login" className="text-BaseColor font-semibold hover:underline">
                    sign in
                  </Link>{' '}
                  to leave a review.
                </p>
              )}

              {/* Display Reviews */}
              <div className="space-y-8">
                {reviewsArray.length > 0 ? (
                  reviewsArray.map((review, index) => (
                    <div
                      key={review._id || `review-${index}`}
                      className="p-6 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start gap-5">
                        <img
                          src={review.userAvatar || avatar}
                          alt={review.username || 'User'}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xl font-semibold text-gray-900 tracking-wide">
                              {review.username || 'Anonymous'}
                            </h5>
                            <span className="flex items-center gap-1 text-yellow-500 text-lg font-semibold">
                              {review.rating || 0} <FaStar />
                            </span>
                          </div>
                          {review.createdAt && (
                            <p className="text-sm text-gray-500 mb-3 italic">
                              {new Date(review.createdAt).toLocaleDateString(
                                'en-US',
                                dateDisplayOptions
                              )}
                            </p>
                          )}
                          <p className="text-gray-800 text-lg leading-relaxed">
                            {review.reviewText || 'No review text.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700 text-lg italic">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <Booking
                title={title}
                price={price}
                avgRating={avgRating}
                reviewsArray={reviewsArray}
                tourId={id}
                tourMaxGroupSize={maxGroupSize}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-BaseColor text-2xl">{icon}</span>
    <div>
      <span className="text-gray-600 font-medium">{label}: </span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TourDetails;