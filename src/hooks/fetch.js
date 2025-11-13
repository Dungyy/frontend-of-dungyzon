import { useState, useEffect, useCallback, useRef } from 'react';
import Axios from 'axios';
import { URL } from '../global';

export const useSearchData = (initialQuery, initialPage, options = {}) => {
  const { itemsPerPage = 50, maxRetries = 3, enabled = true } = options;

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: false,
    itemsPerPage: itemsPerPage,
  });
  const [retryCount, setRetryCount] = useState(0);

  // Use ref to track previous query to detect changes
  const prevQueryRef = useRef(initialQuery);
  const retryTimeoutRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!query || !enabled) {
      setPagination({
        page: 1,
        totalPages: 0,
        total: 0,
        hasMore: false,
        itemsPerPage: itemsPerPage,
      });
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching page ${currentPage} for query: ${query}`);

      const res = await Axios.get(`${URL}/search/${query}?page=${currentPage}`, {
        timeout: 30000,
      });

      const results = res.data.results || res.data || [];
      console.log('Fetched results:', results.length, 'items for page', currentPage);
      console.log('API Response:', res.data); // ← See what your API actually returns

      // Check if API provides total
      const total = res.data.total || res.data.totalResults || res.data.total_results;

      let calculatedTotalPages;
      let hasMorePages;

      if (total !== undefined && total !== null) {
        // API provided total - use it
        calculatedTotalPages = Math.ceil(total / itemsPerPage);
        hasMorePages = currentPage < calculatedTotalPages;
        console.log('Using API total:', total);
      } else {
        // API didn't provide total - estimate based on results
        // If we got a full page of results, assume there might be more
        hasMorePages = results.length >= itemsPerPage;
        // Show at least 10 pages if we're getting full results
        calculatedTotalPages = hasMorePages ? Math.max(10, currentPage + 1) : currentPage;
        console.log('Estimating pagination - no total from API');
      }

      setSearchResults(results);
      setPagination({
        page: currentPage,
        totalPages: calculatedTotalPages,
        total: total || results.length,
        hasMore: hasMorePages,
        itemsPerPage: itemsPerPage,
      });

      setRetryCount(0);
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch results';
      setError({ message: errorMessage, code: err.response?.status });

      if (retryCount < maxRetries) {
        const delay = 1000 * (retryCount + 1);
        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);

        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, currentPage, enabled, itemsPerPage, retryCount, maxRetries]);

  // Fetch data when query, page, or retryCount changes
  useEffect(() => {
    fetchData();

    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [query, currentPage, retryCount]);

  // Reset to page 1 when query changes
  useEffect(() => {
    if (query && query !== prevQueryRef.current) {
      console.log('Query changed, resetting to page 1');
      setCurrentPage(1);
      setRetryCount(0);
      prevQueryRef.current = query;
    }
  }, [query]);

  const refetch = useCallback(() => {
    setRetryCount(0);
    setError(null);
    fetchData();
  }, [fetchData]);

  return {
    searchResults,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages: pagination.totalPages,
    hasMore: pagination.hasMore,
    pagination,
    error,
    setQuery,
    refetch,
  };
};
