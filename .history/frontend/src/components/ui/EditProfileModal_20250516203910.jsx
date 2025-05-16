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
      }, 50);
    }
  }, [user, isOpen]);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Username validation
    if (formData.username && formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to set a new password";
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
      // Handle profile picture upload first if there is one
      let photoUrl = user.photo;
      
      if (profileImage) {
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        
        try {
          const uploadResponse = await fetch(`${BASE_URL}/users/upload-photo`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload profile picture');
          }
          
          const uploadResult = await uploadResponse.json();
          photoUrl = uploadResult.photoUrl;
        } catch (uploadError) {
          console.error('Profile picture upload error:', uploadError);
          toast.error('Failed to upload profile picture. Continuing with other updates.');
        }
      }

      // Prepare data to send
      const updateData = {};

      // Only include fields that changed
      if (formData.username !== user.username) {
        updateData.username = formData.username;
      }

      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // Add photo URL if it was updated
      if (photoUrl !== user.photo) {
        updateData.photo = photoUrl;
      }

      const response = await fetch(`${BASE_URL}/users/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        // Update context with new user data
        dispatch({
          type: "UPDATE_USER",
          payload: { user: result.data },
        });

        toast.success("Profile updated successfully");
        handleClose();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl transform transition-transform duration-300"
        style={{ transform: isVisible ? "scale(1)" : "scale(0.95)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="w-24 h-24 rounded-full border-2 border-BaseColor relative overflow-hidden cursor-pointer mb-2"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/user.png";
                  }} 
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
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
              className="text-BaseColor text-sm hover:underline"
            >
              Upload Picture
            </button>
          </div>
          
          <div>
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
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
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
              disabled={user?.authProvider === "google"}
              className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent ${
                user?.authProvider === "google" ? "bg-slate-100" : ""
              }`}
            />
            {user?.authProvider === "google" && (
              <p className="text-slate-500 text-xs mt-1">
                Email cannot be changed for Google accounts
              </p>
            )}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Profile Image Upload */}
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImage(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          {/* Password section - only show for non-Google users */}
          {user?.authProvider !== "google" && (
            <>
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="font-medium text-slate-700 mb-2">
                  Change Password (Optional)
                </h3>

                <div className="mb-3">
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInput}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent"
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInput}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
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
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-BaseColor focus:border-transparent"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-BaseColor text-white rounded-lg hover:bg-BHoverColor transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
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
