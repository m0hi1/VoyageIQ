import React from 'react';

/**
 * A reusable form button component with loading state
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (submit, button, reset)
 * @param {string} props.text - Button text
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.loadingText - Text to show during loading
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const FormButton = ({ 
  type = 'submit', 
  text = 'Submit', 
  isLoading = false, 
  loadingText = 'Loading...', 
  onClick, 
  className = '',
  ...props 
}) => {
  const baseClass = 'w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-BaseColor hover:bg-BHoverColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-BaseColor disabled:opacity-60 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5';
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        text
      )}
    </button>
  );
};

export default FormButton;
