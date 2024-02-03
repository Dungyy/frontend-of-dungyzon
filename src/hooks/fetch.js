import { useState, useEffect } from 'react';
import Axios from 'axios';
import { URL } from '../global';

export const useSearchData = (initialQuery, initialPage) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await Axios.get(`${URL}/search/${query}?page=${currentPage}`);
      setSearchResults(res.data.results);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchData();
  }, [query, currentPage]);

  return { searchResults, isLoading, currentPage, setCurrentPage, error, setQuery };
};
