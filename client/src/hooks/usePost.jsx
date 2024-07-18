import { useState } from 'react';

const usePostRequest = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postRequest = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to add user. Status: ${response.status}`);
      }
      const responseData = await response.json();
      setResponse(responseData);
      setError(null); // Reset error state on successful response
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { postRequest, isLoading, error, response };
};

export default usePostRequest;
