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

  useEffect(() => {
    // This effect updates tour-specific details and recalculates price if props change
    const guestCount = Number(bookingDetails.guestSize) || 1; // Use current guestSize
    const newSubtotal = price * guestCount;
    const newGstAmount = newSubtotal * GST_RATE;
    const newFinalPrice = newSubtotal + newGstAmount;

    setBookingDetails(prev => ({
      ...prev,
      tourId: tourId,
      tourName: title,
      subtotal: newSubtotal,
      gstAmount: newGstAmount,
      finalPrice: newFinalPrice,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, tourId, price]); // guestSize is managed by the other useEffect to avoid loops

  const handleChange = e => {
    setBookingDetails(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) {
      toast.error('Please Sign In first');
      navigate('/login');
      return;
    }

    const payload = {
      tourId: bookingDetails.tourId,
      tourName: bookingDetails.tourName,
      fullName: bookingDetails.fullName,
      phone: bookingDetails.phone,
      guestSize: parseInt(bookingDetails.guestSize),
      date: bookingDetails.date,
      totalPrice: bookingDetails.finalPrice, // Send the final price including GST
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
      toast.error('Server not responding or booking failed. Please try again.');
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center ">
        <h3 className="text-[25px] md:text-[40px]  font-bold mb-4 text-start text-BaseColor">
          ₹{price} <span>/per person</span>
        </h3>
        <div className="flex items-center gap-2">
          <i>
            <FaStar />
          </i>
          <span className="flex gap-1">
            <div>{avgRating}</div>
            <div>({reviewsArray.length})</div>
          </span>
        </div>
      </div>
      <div className="py-6 space-y-4">
        <h5 className="text-[18px] md:text-2xl font-semibold">
          Booking Information
        </h5>

        {!user ? (
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
            <p className="text-gray-700 mb-4">
              Please log in to book this tour. Booking is only available for logged-in users.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn w-full"
            >
              Log In to Book
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <input
                className="booking_input"
                type="text"
                placeholder="Full Name"
                id="fullName"
                value={bookingDetails.fullName}
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="booking_input"
                type="text"
                placeholder="Contact No."
                id="phone"
                value={bookingDetails.phone}
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="booking_input"
                type="number"
                placeholder="Number of Persons?"
                id="guestSize"
                value={bookingDetails.guestSize}
                min="1"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                className="booking_input"
                type="date"
                id="date"
                value={bookingDetails.date}
                min={currentDate}
                required
                onChange={handleChange}
              />
            </div>
            <div className="mt-12">
              <PricingBreakdown
                subtotal={bookingDetails.subtotal}
                gstAmount={bookingDetails.gstAmount}
                finalPrice={bookingDetails.finalPrice}
                guestSize={bookingDetails.guestSize}
              />
            </div>
            <button type="submit" className="btn w-full">
              Book Now
            </button>
          </form>
        )}
      </div>
      <TrustIndicators />
    </div>
  );
};

export default Booking;
