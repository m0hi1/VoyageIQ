import React from 'react';

/**
 * A reusable social button component with loading state
 * 
 * @param {Object} props - Component props
 * @param {string} props.provider - Social provider (google, facebook, twitter, etc)
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.loadingText - Text to show during loading
 * @param {string} props.className - Additional CSS classes
 */
const SocialButton = ({ 
  provider = 'google', 
  onClick, 
  isLoading = false, 
  loadingText = 'Connecting...', 
  className = '',
  ...props 
}) => {
  const baseClass = 'w-full mt-2 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor transition-all duration-150 ease-in-out flex items-center justify-center';
  
  const getProviderIcon = () => {
    switch(provider.toLowerCase()) {
      case 'google':
        return (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12V14.26H17.94C17.71,15.63 16.95,16.82 15.82,17.56V20.18H19.45C21.45,18.37 22.56,15.54 22.56,12.25Z" fill="#4285F4" />
            <path d="M12,23C14.97,23 17.45,22.04 19.45,20.18L15.82,17.56C14.83,18.22 13.53,18.62 12,18.62C9.31,18.62 7.02,16.88 6.19,14.54H2.44V17.21C4.44,20.69 7.96,23 12,23Z" fill="#34A853" />
            <path d="M6.19,14.54C5.96,13.82 5.82,13.06 5.82,12.25C5.82,11.44 5.96,10.68 6.19,9.96V7.29H2.44C1.5,8.99 1,10.56 1,12.25C1,13.94 1.5,15.51 2.44,17.21L6.19,14.54Z" fill="#FBBC05" />
            <path d="M12,5.88C13.68,5.88 15.11,6.46 16.21,7.48L19.52,4.39C17.45,2.59 14.97,1.5 12,1.5C7.96,1.5 4.44,3.81 2.44,7.29L6.19,9.96C7.02,7.62 9.31,5.88 12,5.88Z" fill="#EA4335" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="#1DA1F2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getButtonText = () => {
    return `${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700"
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
          {loadingText}
        </>
      ) : (
        <>
          {getProviderIcon()}
          Continue with {getButtonText()}
        </>
      )}
    </button>
  );
};

export default SocialButton;
