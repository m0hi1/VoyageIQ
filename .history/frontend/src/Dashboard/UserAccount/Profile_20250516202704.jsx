import { useContext, useEffect, useState } from "react";
import BASE_URL from "../../utils/config";
import { AuthContext } from '../../contexts/AuthContext';
import EditProfileModal from "../../components/ui/EditProfileModal";

const Profile = () => {  
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Animation state for profile card
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    // Add entrance animation
    setTimeout(() => {
      setCardVisible(true);
    }, 100);
  }, []);

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  if (!user) {
    return (
      <div className="py-8 text-center">
        <p>Loading user profile...</p>
        {/* Or redirect to login if no user and not loading */}
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-0">
      <h2 className="text-2xl font-semibold text-slate-700 mb-6">My Profile</h2>
      <div className={`max-w-lg mx-auto bg-white p-6 rounded-lg shadow transition-all duration-300 ${cardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Profile Info Card */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full border-2 border-solid border-BaseColor flex items-center justify-center overflow-hidden bg-slate-100">            {user.photo ? (
              <img 
                src={user.photo.startsWith('http') ? user.photo : `${BASE_URL}/${user.photo}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite error loop
                  e.target.src = "/user.png"; // Use default avatar from public folder
                }}
              />
            ) : (
              <span className="text-2xl text-slate-400">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{user.username || user.displayName}</h3>
            <p className="text-slate-600">{user.email}</p>
            <p className="text-sm text-slate-500 mt-1">
              Account type: {user?.authProvider === 'google' ? 'Google Account' : 'Email & Password'}
            </p>
          </div>
        </div>
        
        {/* User Information */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-slate-500 mb-1">Username</h4>
            <p className="text-slate-700">{user.username || user.displayName}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-slate-500 mb-1">Email Address</h4>
            <p className="text-slate-700">{user.email}</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-slate-500 mb-1">Member Since</h4>
            <p className="text-slate-700">
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </p>
          </div>
        </div>        
        {/* Edit Profile Button */}
        <div className="mt-6">
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="Searchbtn w-full rounded-md py-2.5 text-base font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
      
      {/* EditProfileModal */}
      {isModalOpen && (
        <EditProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Profile;
