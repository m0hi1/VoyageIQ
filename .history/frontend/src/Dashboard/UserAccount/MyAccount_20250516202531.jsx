import { useContext, useState } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from "react-toastify";
import avatar from "../../assets/images/avatar.jpg";
import defaultAvatar from "../../assets/images/user.png"; // Adding fallback avatar
import Bookings from "./Bookings";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import MyTrips from "./MyTrips";
import { clearToken, getCurrentUser } from "../../utils/firebase-auth";

const MyAccount = () => {
  const { user, dispatch, token } = useContext(AuthContext);
  const [tab, setTab] = useState("trips");
  const navigate = useNavigate();

  const confirmDelete = async () => {
    const result = window.confirm(
      "Are you sure you want to delete your account?"
    );    if (result) {
      deleteAccount();
    }
  };
  
  const deleteAccount = async () => {
    try {
      // 1. Delete the user account from backend
      const response = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      const { message } = await response.json();

      if (!response.ok) {
        toast.error(message);
        return;
      }
      
      // 2. If backend deletion successful, try to delete Firebase account too
      try {
        // Check if there's a Firebase user signed in
        const firebaseUser = getCurrentUser();
        if (firebaseUser) {
          // Delete the Firebase user
          await firebaseUser.delete();
        }
      } catch (firebaseError) {
        console.error("Could not delete Firebase account:", firebaseError);
        // Continue with local logout even if Firebase deletion fails
      }
      
      // 3. Clear Firebase auth state
      await clearToken();
      
      // 4. Call backend logout to clear cookies
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
        // 5. Update local state and navigate
      dispatch({ type: "LOGOUT" });
      toast.success("Your account has been successfully deleted");
      navigate("/register");
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <section>
      <div className="max-w-[1170px] py-4 px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="py-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-Color overflow-hidden">
                <img
                  src={user.photo || avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </figure>
            </div>

            <div className="text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-HeadingColor font-bold">
                {user.username}
              </h3>
              <p className="text-TextColor text-[15px] leading-6 font-medium">
                {user.email}
              </p>
            </div>

            <div className="mt-[50px] md:mt-[70px]">
              <button
                onClick={() => setTab("settings")}
                className="w-full mb-2 btn"
              >
                Update Profile
              </button>
              <button
                onClick={confirmDelete}
                className="w-full bg-black noCbtn hover:bg-gray-900 "
              >
                Delete Account
              </button>
            </div>
          </div>

          <div className="col-span-2 md:px-[30px]">
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => setTab("trips")}
                className={`${
                  tab === "trips" && "bg-GrayColor text-white font-bold"
                } p-2 px-3 lg:px-5 rounded-md text-HeadingColor font-semibold text-[13px] md:text-[14px] lg:text-[16px] leading-7 border border-solid border-Color`}
              >
                My Trips
              </button>
              <button
                onClick={() => setTab("bookings")}
                className={`${
                  tab === "bookings" && "bg-GrayColor text-white font-bold"
                } p-2 px-3 lg:px-5 rounded-md text-HeadingColor font-semibold text-[13px] md:text-[14px] lg:text-[16px] leading-7 border border-solid border-Color`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setTab("settings")}
                className={`${
                  tab === "settings" && "bg-GrayColor text-white font-bold"
                } p-2 px-3 lg:px-5 rounded-md text-HeadingColor font-semibold text-[13px] md:text-[14px] lg:text-[16px] leading-7 border border-solid border-Color`}
              >
                Profile Settings
              </button>
            </div>

            {tab === "trips" && <MyTrips />}
            {tab === "bookings" && <Bookings />}
            {tab === "settings" && (
              <Profile user={user} dispatch={dispatch} token={token} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
