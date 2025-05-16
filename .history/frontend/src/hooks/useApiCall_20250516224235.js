import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for handling API requests with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect (optional)
 * @param {boolean} executeOnMount - Whether to execute the API call on component mount
 * @returns {Object} { data, loading, error, execute }
 */
const useApiCall = (apiFunction, dependencies = [], executeOnMount = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeOnMount);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (executeOnMount) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, execute };
};

export default useApiCall;
