import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, { params });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, params]); // Incluímos `params` diretamente como dependência

  return { data, loading, error };
};

export default useFetchData;
