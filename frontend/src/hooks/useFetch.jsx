import React, { useEffect, useState } from 'react';

const useFetch = url => {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError('URL is not provided to useFetch.'); // More specific message
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error before new fetch
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Accept: 'application/json', // Specify we want JSON in response
        };
        // Ensure token is not "null" or "undefined" as strings from localStorage
        if (token && token !== 'null' && token !== 'undefined') {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
          const result = await response.json(); // Parse JSON
          if (!response.ok) {
            // Use message from JSON response if available, otherwise status text
            setError(
              result.message ||
                `API Error: ${response.status} ${response.statusText}`
            );
            setApiData(null);
          } else {
            // Assuming backend consistently returns data under a 'data' property
            setApiData(result.data);
          }
        } else {
          // Response is not JSON
          const responseText = await response.text(); // Get text for logging/debugging
          if (!response.ok) {
            console.error(
              `Non-JSON error response from ${url}: Status ${response.status}`,
              responseText
            );
            setError(
              `Server Error: ${response.status} ${response.statusText}. Expected JSON but received another format. Check console for details.`
            );
            setApiData(null);
          } else {
            // Successful response but not JSON. This is unexpected for this hook's typical usage.
            console.warn(
              `Received non-JSON response for a successful request to ${url}:`,
              responseText
            );
            setError(
              'Received unexpected non-JSON response from server. Check console for details.'
            );
            setApiData(null);
          }
        }
      } catch (err) {
        console.error(`Fetch error for ${url}:`, err); // Log the actual error
        let errorMessage =
          'An unexpected network error occurred. Please check your connection.';
        // Check if it's a JSON parsing error specifically
        if (
          err instanceof SyntaxError &&
          err.message.toLowerCase().includes('json')
        ) {
          errorMessage = `Failed to parse server response from ${url}. Expected JSON but received something else. Check console for details.`;
        } else if (err.message) {
          errorMessage = err.message; // Use the error's message if available
        }
        setError(errorMessage);
        setApiData(null); // Ensure data is null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Dependency array only on url.

  return { apiData, error, loading };
};

export default useFetch;
