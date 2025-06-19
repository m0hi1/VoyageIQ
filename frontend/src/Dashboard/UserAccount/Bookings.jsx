import { useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import BASE_URL from '../../utils/config';
import { AuthContext } from '../../contexts/AuthContext';
import BookingCard from '../../shared/BookingCard';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  // Corrected URL: Fetch all bookings; backend will filter by user if not admin.
  // The user._id might not be needed here if the backend uses the token to identify the user for their bookings.
  // If the backend specifically requires user ID for non-admin roles on GET /bookings, this might need adjustment
  // or a dedicated /users/:userId/bookings endpoint. Assuming /bookings handles it via token.
  const { apiData: bookings } = useFetch(`${BASE_URL}/bookings`);

  return (
    <div className="py-8">
      <div className="flex flex-col gap-5">
        <table className="w-full table-auto text-xs md:text-sm gap-4 border-collapse border">
          <thead className="w-full py-2">
            <tr>
              <th className="tableData">Tour</th>
              <th className="hidden md:block tableData">Persons</th>
              <th className="tableData">Booked for</th>
              <th className="tableData">Price</th>
              <th></th>
            </tr>
          </thead>
          {bookings?.map(booking => (
            <BookingCard booking={booking} key={booking._id} />
          ))}
        </table>
      </div>
    </div>
  );
};

export default Bookings;
