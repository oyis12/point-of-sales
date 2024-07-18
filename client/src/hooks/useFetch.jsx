import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Could not fetch the data for that resource');
        }
        const fetchedData = await response.json();
        setIsPending(false);
        setData(fetchedData);
        setError(null);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };

    fetchData();

    return () => {};
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
