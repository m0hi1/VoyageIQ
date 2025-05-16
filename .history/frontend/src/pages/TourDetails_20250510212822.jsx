import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
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
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-BaseColor"></div>
  </div>
);
// A simple error message component
const ErrorDisplay = ({ message }) => (
  <div className="text-center py-10">
    <p className="text-red-500 text-xl">
      Error: {message || 'Something went wrong.'}
    </p>
  </div>
);

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

// Hardcoded reviews data as a fallback
// const hardcodedReviewsData = [ // This line was duplicated and is now commented out or removed
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
    // userAvatar: null, // Will use default avatar
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
  } = useFetch(`${BASE_URL}/tours/${id}`); // Changed /tour/ to /tours/

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (fetchedTour) {
      // Use fetched reviews if available and not empty, otherwise use hardcoded reviews
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
    reviews = [], // Default to empty array, will be populated by useEffect
    city = 'Unknown City',
    distance = 'N/A',
    maxGroupSize = 'N/A',
    address = 'No address provided.',
  } = tourData || {};

  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const { avgRating } = CalculateAvg(reviewsArray); // avgRating is now consistently a number

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
          // "Authorization": `Bearer ${user.token}` // Uncomment if auth is needed
        },
        body: JSON.stringify(reviewPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Review submitted successfully!');
        const newReview = result.data;
        if (newReview && tourData) {
          // If current reviews are hardcoded, replace them with the new real review
          // Or, if you want to add to hardcoded ones (less ideal for this scenario):
          // const currentReviewsAreHardcoded = reviewsArray.some(r => r._id.startsWith('hc_review_'));
          // if (currentReviewsAreHardcoded) {
          //   setTourData(prev => ({ ...prev, reviews: [newReview] }));
          // } else {
          setTourData(prev => ({
            ...prev,
            reviews: Array.isArray(prev.reviews)
              ? [...prev.reviews, newReview]
              : [newReview],
          }));
          // }
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
    return <ErrorDisplay message="Tour not found." />;
  }

  return (
    <section className="my-4 px-4 sm:px-8 md:px-12 w-full">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Tour Image and Details */}
          <div className="lg:w-2/3">
            {photo && (
              <div className="rounded-lg overflow-hidden shadow-lg mb-8 max-h-[500px]">
                <img
                  src={photo}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-BaseColor mb-4">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-700">
                <span className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  {reviewsArray.length > 0
                    ? `${avgRating.toFixed(1)} (${reviewsArray.length} reviews)` // avgRating is now a number, .toFixed(1) is safe
                    : 'No reviews yet'}
                </span>
                <span className="flex items-center gap-2">
                  <FaMapPin className="text-BaseColor" /> {address}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 pt-4 border-t border-gray-200">
                <InfoItem icon={<FaCity />} label="City" value={city} />
                <InfoItem
                  icon={<FaLocationDot />}
                  label="Distance"
                  value={`${distance} km`}
                />
                <InfoItem
                  icon={<FaDollarSign />}
                  label="Price"
                  value={`Rs. ${price} /per person`}
                />
                <InfoItem
                  icon={<FaPeopleGroup />}
                  label="Max Group Size"
                  value={`${maxGroupSize} people`}
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-10 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                Reviews ({reviewsArray.length})
              </h3>
              {user && (
                <form onSubmit={handleReviewSubmit} className="mb-8">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-700">
                      Your Rating:
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl transition-colors duration-150 ease-in-out ${
                            star <= (hoverRating || selectedRating)
                              ? 'text-yellow-500'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <textarea
                      ref={reviewMsgRef}
                      placeholder="Share your thoughts about this tour..."
                      className="w-full flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-shadow"
                      rows="3"
                      disabled={isSubmittingReview}
                    />
                    <button
                      type="submit"
                      className="bg-BaseColor hover:bg-BHoverColor text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
              {!user && (
                <p className="mb-8 text-gray-600">
                  Please{' '}
                  <a href="/login" className="text-BaseColor hover:underline">
                    sign in
                  </a>{' '}
                  to leave a review.
                </p>
              )}

              {/* Display Reviews */}
              <div className="space-y-6">
                {reviewsArray.length > 0 ? (
                  reviewsArray.map((review, index) => (
                    <div
                      key={review._id || `review-${index}`} // Ensure unique key
                      className="p-4 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.userAvatar || avatar}
                          alt={review.username || 'User'}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-lg font-semibold text-gray-800">
                              {review.username || 'Anonymous'}
                            </h5>
                            <span className="flex items-center gap-1 text-yellow-500">
                              {review.rating || 0} <FaStar />
                            </span>
                          </div>
                          {review.createdAt && (
                            <p className="text-xs text-gray-500 mb-2">
                              {new Date(review.createdAt).toLocaleDateString(
                                'en-US',
                                dateDisplayOptions
                              )}
                            </p>
                          )}
                          <p className="text-gray-700">
                            {review.reviewText || 'No review text.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <Booking
                title={title}
                price={price}
                avgRating={avgRating} // Pass the numeric avgRating
                reviewsArray={reviewsArray}
                tourId={id} // Pass the tour ID
                tourMaxGroupSize={maxGroupSize} // Pass the tour's max group size
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="text-BaseColor text-xl">{icon}</span>
    <div>
      <span className="text-gray-600">{label}: </span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TourDetails;
