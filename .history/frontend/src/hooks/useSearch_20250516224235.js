import { useState, useCallback } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../config/constants';

/**
 * Custom hook for handling search with debouncing
 * @param {Function} searchFunction - Function to execute search
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - { query, results, loading, error, handleSearch, clearSearch }
 */
const useSearch = (searchFunction, delay = SEARCH_DEBOUNCE_MS) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleSearch = useCallback(
    (searchQuery) => {
      setQuery(searchQuery);
      setLoading(true);

      // Clear any existing timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Set a new timeout
      const timeout = setTimeout(async () => {
        if (searchQuery.trim() === '') {
          setResults([]);
          setLoading(false);
          return;
        }

        try {
          const response = await searchFunction(searchQuery);
          setResults(response);
          setError(null);
        } catch (err) {
          setError(err.message || 'Search failed');
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, delay);

      setDebounceTimeout(timeout);
    },
    [searchFunction, delay, debounceTimeout]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
    setError(null);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  }, [debounceTimeout]);

  return {
    query,
    results,
    loading,
    error,
    handleSearch,
    clearSearch
  };
};

export default useSearch;
