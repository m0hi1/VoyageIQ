import { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import BASE_URL from "../../utils/config";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, token, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  
  // Animation states for modal transition
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
      
      // Set initial profile image if user has one
      if (user.photo) {
        setPreviewImage(user.photo.startsWith('http') ? user.photo : `${BASE_URL}/${user.photo}`);
      }
    }

    // Trigger animation after component mounts
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    }
  }, [user, isOpen]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    // Password validations
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
        isValid = false;
      }

      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
        isValid = false;
      } else if (
        !/\d/.test(formData.newPassword) ||
        !/[a-zA-Z]/.test(formData.newPassword)
      ) {
        newErrors.newPassword =
          "Password must contain both letters and numbers";
        isValid = false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle modal close with animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the CSS transition duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skip if nothing changed
    if (
      formData.username === user.username &&
      formData.email === user.email &&
      !formData.newPassword &&
      !profileImage
    ) {
      toast.info("No changes made");
      handleClose();
      return;
    }

    // Validate the form data
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object for multipart form data
      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("email", formData.email);
      
      if (formData.currentPassword) {
        formDataObj.append("currentPassword", formData.currentPassword);
      }
      
      if (formData.newPassword) {
        formDataObj.append("newPassword", formData.newPassword);
      }
      
      if (profileImage) {
        formDataObj.append("profileImage", profileImage);
      }

      const response = await fetch(`${BASE_URL}/users/update-profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (response.ok) {
        // Update the user in context
        dispatch({
          type: "UPDATE_USER",
          payload: {
            user: data.data,
          },
        });

        toast.success("Profile updated successfully");
        handleClose();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative transition-transform duration-300 ${isVisible ? "scale-100" : "scale-95"}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-gray-300">
              <img 
                src={previewImage || user?.photo || "/user.png"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfileImage(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 text-sm hover:underline"
              disabled={isLoading}
            >
              Upload Picture
            </button>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInput}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Current Password
              <span className="text-gray-400 ml-2">(only if changing password)</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInput}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              New Password
              <span className="text-gray-400 ml-2">(optional)</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInput}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInput}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 mr-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;