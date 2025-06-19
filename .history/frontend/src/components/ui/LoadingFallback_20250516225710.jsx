import React from 'react';

/**
 * Loading fallback component displayed during lazy loading
 * @returns {JSX.Element} Loading component
 */
const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
