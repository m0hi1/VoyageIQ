import { useState, useContext, useEffect } from 'react';
import { FaStar, FaCalendar, FaUsers, FaShield, FaCreditCard } from 'react-icons/fa6';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import BASE_URL from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const GST_RATE = 0.05; // 5% GST for tour packages

// Enhanced pricing breakdown component
const PricingBreakdown = ({ subtotal, gstAmount, finalPrice, guestSize }) => (
  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
    <h4 className="font-semibold text-gray-900">Price Breakdown</h4>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">
          ₹{(subtotal / guestSize).toLocaleString('en-IN')} × {guestSize} {guestSize === 1 ? 'person' : 'people'}
        </span>
        <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">GST (5%)</span>
        <span className="font-medium">₹{gstAmount.toLocaleString('en-IN')}</span>
      </div>
      <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-orange-600">₹{finalPrice.toLocaleString('en-IN')}</span>
      </div>
    </div>
  </div>
);

// Trust indicators component
const TrustIndicators = () => (
  <div className="grid grid-cols-2 gap-4 mt-6">
    {[
      { icon: <FaShield />, text: 'Secure Payment' },
      { icon: <FaCheckCircle />, text: 'Instant Confirmation' },
      { icon: <FaCreditCard />, text: 'Easy Cancellation' },
      { icon: <FaUsers />, text: 'Expert Guides' },
    ].map((item, index) => (
      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
        <div className="text-green-500">{item.icon}</div>
        <span>{item.text}</span>
      </div>
    ))}
  </div>
);

const Booking = ({
  price,
  title,
  reviewsArray,
  avgRating,
  tourId,
  tourMaxGroupSize,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [bookingDetails, setBookingDetails] = useState({
    tourId: tourId,
    tourName: title,
    fullName: '',
    phone: '',
    guestSize: 1,
    date: '',
    subtotal: price,
    gstAmount: price * GST_RATE,
    finalPrice: price * (1 + GST_RATE),
  });

  useEffect(() => {
    const guestCount = Number(bookingDetails.guestSize) || 1;
    const newSubtotal = price * guestCount;
    const newGstAmount = newSubtotal * GST_RATE;
    const newFinalPrice = newSubtotal + newGstAmount;

    setBookingDetails(prev => ({
      ...prev,
      subtotal: newSubtotal,
      gstAmount: newGstAmount,
      finalPrice: newFinalPrice,
    }));
  }, [price, bookingDetails.guestSize]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to make a booking.');
      return;
    }

    const payload = {
      userId: user._id,
      userEmail: user.email,
      tourName: title,
      fullName: bookingDetails.fullName,
      guestSize: parseInt(bookingDetails.guestSize),
      phone: bookingDetails.phone,
      bookedAt: new Date().toISOString(),
      date: bookingDetails.date,
      totalPrice: bookingDetails.finalPrice,
      maxGroupSize: parseInt(tourMaxGroupSize),
    };

    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Booking successful!');
        navigate('/booked');
      } else {
        toast.error(result.message || 'Failed to create booking.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error('Server not responding. Please try again.');
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-3xl font-bold mb-2">
              ₹{price.toLocaleString('en-IN')}
            </h3>
            <span className="text-orange-100 text-lg">per person</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full">
            <FaStar className="text-yellow-300" />
            <span className="font-semibold">
              {avgRating > 0 ? avgRating.toFixed(1) : 'New'}
            </span>
            <span className="text-orange-100">
              ({reviewsArray.length})
            </span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6">
        {!user ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-orange-500 text-2xl" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Book?
            </h4>
            <p className="text-gray-600 mb-6">
              Please sign in to continue with your booking
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In to Book
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h5 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Details
              </h5>

              {/* Full Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={bookingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter your phone number"
                  required
                />
              </div>              {/* Date and Guest Size Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingDetails.date}
                    onChange={handleInputChange}
                    min={currentDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUsers className="inline mr-2" />
                    Guests
                  </label>
                  <select
                    name="guestSize"
                    value={bookingDetails.guestSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    required
                  >
                    {[...Array(parseInt(tourMaxGroupSize) || 10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1} {index + 1 === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <PricingBreakdown
              subtotal={bookingDetails.subtotal}
              gstAmount={bookingDetails.gstAmount}
              finalPrice={bookingDetails.finalPrice}
              guestSize={bookingDetails.guestSize}
            />            {/* Book Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base md:text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Now - ₹{bookingDetails.finalPrice.toLocaleString('en-IN')}
            </button>

            {/* Trust Indicators */}
            <TrustIndicators />
          </form>
        )}
      </div>
    </div>
  );
};

export default Booking;
