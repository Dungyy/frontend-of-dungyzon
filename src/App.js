// Enhanced App.js with Real Pagination Support
import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Container, Row, Col, Alert, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { SpinnerDiamond } from 'spinners-react';
import { ErrorBoundary } from 'react-error-boundary';
import { debounce } from 'lodash';

// Components - Using lazy loading for better performance
const NavbarComponent = React.lazy(() => import('./Components/Navbar'));
const SearchForm = React.lazy(() => import('./Components/SearchForm'));
const PaginationComponent = React.lazy(() => import('./Components/Pagination'));
const ProductCard = React.lazy(() => import('./Components/Card'));
const Footer = React.lazy(() => import('./Components/Footer'));

// Hooks and utilities
import { useSearchData } from './hooks/fetch';
import { ErrorMessage } from './Components/utils/utils';
import { useLocalStorage, useOnlineStatus, useDocumentTitle } from './hooks/customHooks';
import './App.css';

// Constants
const ITEMS_PER_PAGE = 20;
const DEBOUNCE_DELAY = 500;
const MAX_RETRIES = 3;
const STORAGE_KEYS = {
  DARK_MODE: 'dungyzon_dark_mode',
  SEARCH_HISTORY: 'dungyzon_search_history',
  LAST_SEARCH: 'dungyzon_last_search',
};

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary, isDarkMode }) => (
  <Container fluid className="text-center py-5">
    <Alert color="danger" className={isDarkMode ? 'dark-alert' : ''}>
      <h4 className="alert-heading">Oops! Something went wrong</h4>
      <p className="mb-3">We encountered an unexpected error. Please try refreshing the page.</p>
      <hr />
      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-outline-danger" onClick={resetErrorBoundary}>
          Try Again
        </button>
        <button className="btn btn-danger" onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-3">
          <summary>Error Details (Development Only)</summary>
          <pre className="text-start mt-2">{error.message}</pre>
        </details>
      )}
    </Alert>
  </Container>
);

// Loading Skeleton Component
const ProductCardSkeleton = ({ isDarkMode }) => (
  <div className={`product-card-skeleton ${isDarkMode ? 'dark' : 'light'}`}>
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-price"></div>
      <div className="skeleton-line skeleton-rating"></div>
    </div>
  </div>
);

// Search Statistics Component with Pagination Info
const SearchStats = React.memo(function SearchStats({
  searchResults,
  currentQuery,
  isLoading,
  isDarkMode,
  pagination,
}) {
  if (isLoading || !currentQuery || !Array.isArray(searchResults) || searchResults.length === 0)
    return null;

  const { page, totalPages, total, hasMore } = pagination || {};

  return (
    <Alert color="info" className={`search-stats ${isDarkMode ? 'dark-alert' : ''}`}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small>
            Found <strong>{total || searchResults.length}</strong> results for &quot;
            <em>{currentQuery}</em>&quot;
          </small>
        </div>
        {totalPages > 1 && (
          <div>
            <small className="text-muted">
              Page {page || 1} of {totalPages}
              {hasMore && ' (more available)'}
            </small>
          </div>
        )}
      </div>
    </Alert>
  );
});

// Main App Component
function App() {
  // State management with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useLocalStorage(STORAGE_KEYS.DARK_MODE, false);
  const [searchHistory, setSearchHistory] = useLocalStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  const [lastSearch, setLastSearch] = useLocalStorage(STORAGE_KEYS.LAST_SEARCH, '');
  const [currentQuery, setCurrentQuery] = useState(lastSearch);
  const [retryCount, setRetryCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Custom hooks
  const isOnline = useOnlineStatus();

  // Enhanced search hook with pagination support
  const {
    searchResults,
    isLoading,
    currentPage,
    setCurrentPage,
    error,
    setQuery,
    totalPages,
    hasMore,
    pagination,
    refetch,
  } = useSearchData(currentQuery, 1, {
    itemsPerPage: ITEMS_PER_PAGE,
    maxRetries: MAX_RETRIES,
    enabled: !!currentQuery,
  });

  // Document title management
  useDocumentTitle(
    currentQuery ? `${currentQuery} - Dungyzon Search Results` : 'Dungyzon - Amazon Product Search'
  );

  // Debounced search to improve performance
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim()) {
        setQuery(searchTerm);
        setCurrentQuery(searchTerm);
        setLastSearch(searchTerm);
        setRetryCount(0);
        setCurrentPage(1); // Reset to page 1 for new search
      }
    }, DEBOUNCE_DELAY),
    [setQuery, setLastSearch, setCurrentPage]
  );

  // Handle search submission
  const handleSubmit = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) {
        setToastMessage('Please enter a search term');
        setShowToast(true);
        return;
      }

      if (!isOnline) {
        setToastMessage('No internet connection. Please check your network.');
        setShowToast(true);
        return;
      }

      // Add to search history
      setSearchHistory((prev) => {
        const newHistory = [searchTerm, ...prev.filter((item) => item !== searchTerm)];
        return newHistory.slice(0, 10); // Keep only last 10 searches
      });

      setIsInitialLoad(false);
      debouncedSearch(searchTerm);
    },
    [debouncedSearch, isOnline, setSearchHistory]
  );

  // Enhanced page change handler
  const handlePageChange = useCallback(
    (page) => {
      if (page === currentPage) return;

      setCurrentPage(page);

      // Show loading toast for better UX
      setToastMessage(`Loading page ${page}...`);
      setShowToast(true);

      // Auto-hide toast after loading
      setTimeout(() => setShowToast(false), 2000);

      // Smooth scroll to top of results
      setTimeout(() => {
        const resultsContainer = document.querySelector('.results-section');
        if (resultsContainer) {
          resultsContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 100);
    },
    [setCurrentPage, currentPage]
  );

  // Toggle dark mode with animation
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    // setToastMessage(`Switched to ${!isDarkMode ? 'dark' : 'light'} mode`);
    // setShowToast(true);
  }, [isDarkMode, setIsDarkMode]);

  // Retry failed requests
  const handleRetry = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount((prev) => prev + 1);

      if (typeof refetch === 'function') {
        refetch();
      } else {
        const currentSearchQuery = currentQuery;
        setCurrentQuery('');
        setTimeout(() => setCurrentQuery(currentSearchQuery), 100);
      }

      setToastMessage(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      setShowToast(true);
    }
  }, [retryCount, refetch, currentQuery]);

  // Quick page navigation
  const handleQuickPageJump = useCallback(
    (direction) => {
      const jump = direction === 'forward' ? 5 : -5;
      const newPage = Math.max(1, Math.min(totalPages, currentPage + jump));
      if (newPage !== currentPage) {
        handlePageChange(newPage);
      }
    },
    [currentPage, totalPages, handlePageChange]
  );

  // Memoized components for performance
  const LoadingSpinner = useMemo(
    () => (
      <div className="loading-container">
        <SpinnerDiamond
          size={120}
          thickness={180}
          speed={100}
          color={isDarkMode ? '#4b69f0' : '#007bff'}
          secondaryColor={isDarkMode ? '#333' : '#e9ecef'}
        />
        <p className={`loading-text ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          {retryCount > 0
            ? `Retrying... (${retryCount}/${MAX_RETRIES})`
            : currentPage > 1
              ? `Loading page ${currentPage}...`
              : 'Searching for products...'}
        </p>
      </div>
    ),
    [isDarkMode, retryCount, currentPage]
  );

  const ProductCards = useMemo(() => {
    if (isLoading) {
      return (
        <div className="cards-container">
          {Array.from({ length: ITEMS_PER_PAGE }, (_, index) => (
            <ProductCardSkeleton key={index} isDarkMode={isDarkMode} />
          ))}
        </div>
      );
    }

    if (!Array.isArray(searchResults) || searchResults.length === 0) return null;

    return (
      <div className="cards-container">
        {searchResults.map((result, index) => (
          <Suspense
            key={result.position || result.id || result.asin || `${currentPage}-${index}`}
            fallback={<ProductCardSkeleton isDarkMode={isDarkMode} />}
          >
            <ProductCard result={result} isDarkMode={isDarkMode} lazyLoad={index > 6} />
          </Suspense>
        ))}
      </div>
    );
  }, [searchResults, isLoading, isDarkMode, currentPage]);

  // Enhanced error handling
  const EnhancedErrorMessage = useMemo(() => {
    if (!error) return null;

    const isNetworkError =
      !isOnline || error?.message?.includes('network') || error?.message?.includes('fetch');
    const canRetry = retryCount < MAX_RETRIES;

    return (
      <div className="error-container">
        <ErrorMessage
          message={
            isNetworkError
              ? 'Connection issue. Please check your internet and try again.'
              : error.message || 'Something went wrong. Please try again later.'
          }
          isDarkMode={isDarkMode}
        />
        {canRetry && (
          <div className="retry-actions mt-3">
            <button
              className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'} me-2`}
              onClick={handleRetry}
              disabled={isLoading}
            >
              {isLoading ? 'Retrying...' : `Retry (${retryCount}/${MAX_RETRIES})`}
            </button>
            <button
              className={`btn ${isDarkMode ? 'btn-outline-secondary' : 'btn-outline-dark'}`}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    );
  }, [error, isDarkMode, retryCount, handleRetry, isLoading, isOnline]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    return () => {
      document.body.className = '';
      document.body.style.transition = '';
    };
  }, [isDarkMode]);

  // Cleanup debounced function
  useEffect(() => {
    return () => {
      if (debouncedSearch && typeof debouncedSearch.cancel === 'function') {
        debouncedSearch.cancel();
      }
    };
  }, [debouncedSearch]);

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorFallback {...props} isDarkMode={isDarkMode} />}
      onReset={() => {
        setCurrentQuery('');
        setRetryCount(0);
        setCurrentPage(1);
        window.location.reload();
      }}
    >
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        {/* Offline Indicator */}
        {!isOnline && (
          <Alert color="warning" className="offline-alert mb-0 text-center">
            <small>⚠️ You&apos;re offline. Some features may not work properly.</small>
          </Alert>
        )}

        {/* Navigation */}
        <Suspense fallback={<div className="navbar-skeleton"></div>}>
          <NavbarComponent
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            searchHistory={searchHistory}
            onHistoryItemClick={handleSubmit}
          />
        </Suspense>

        <Container fluid className="main-container">
          {/* Hero Section */}
          <Row className="hero-section">
            <Col md="8" lg="6" className="mx-auto text-center">
              <div className="hero-content">
                <h1 className={`hero-title ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                  Find Your Perfect Product
                </h1>
                <p className={`hero-subtitle ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                  Search millions of Amazon products with real-time data and intelligent
                  recommendations
                </p>

                <Suspense fallback={<div className="search-skeleton"></div>}>
                  <SearchForm
                    handleSubmit={handleSubmit}
                    isDarkMode={isDarkMode}
                    className="search-form-enhanced"
                    placeholder="Search for products (e.g., iPhone, laptop, books...)"
                    suggestions={searchHistory.slice(0, 5)}
                    isLoading={isLoading}
                  />
                </Suspense>

                {/* Quick Search Suggestions */}
                {!currentQuery && searchHistory.length === 0 && (
                  <div className="quick-suggestions mt-3">
                    <small className={isDarkMode ? 'text-light' : 'text-muted'}>
                      Popular searches:
                    </small>
                    {['iPhone 15', 'MacBook Pro', 'AirPods', 'Gaming Laptop'].map((suggestion) => (
                      <button
                        key={suggestion}
                        className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'} ms-2`}
                        onClick={() => handleSubmit(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Search Results */}
          <Row>
            <Col>
              {/* Search Statistics with Pagination Info */}
              <SearchStats
                searchResults={searchResults}
                currentQuery={currentQuery}
                isLoading={isLoading}
                isDarkMode={isDarkMode}
                pagination={pagination}
              />

              {/* Results Content */}
              <div className="results-section">
                {isLoading && !isInitialLoad ? (
                  LoadingSpinner
                ) : error ? (
                  EnhancedErrorMessage
                ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
                  <>
                    {/* Quick Navigation for Large Result Sets */}
                    {totalPages > 10 && (
                      <div className="quick-navigation mb-3 text-center">
                        <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                          Quick Jump:
                        </small>
                        <button
                          className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'} ms-2`}
                          onClick={() => handleQuickPageJump('backward')}
                          disabled={currentPage <= 5}
                        >
                          -5 Pages
                        </button>
                        <button
                          className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'} ms-2`}
                          onClick={() => handleQuickPageJump('forward')}
                          disabled={currentPage >= totalPages - 4}
                        >
                          +5 Pages
                        </button>
                      </div>
                    )}

                    {ProductCards}

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                      <Suspense fallback={<div className="pagination-skeleton"></div>}>
                        <PaginationComponent
                          currentPage={currentPage}
                          totalPages={totalPages}
                          handlePageChange={handlePageChange}
                          isDarkMode={isDarkMode}
                          hasMore={hasMore}
                          className="pagination-enhanced"
                          pagination={pagination}
                          isLoading={isLoading}
                        />
                      </Suspense>
                    )}

                    {/* Load More Button for Mobile */}
                    {hasMore && (
                      <div className="load-more-section text-center mt-4 d-md-none">
                        <button
                          className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'} btn-lg`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Load More Products'}
                        </button>
                      </div>
                    )}
                  </>
                ) : currentQuery && !isInitialLoad ? (
                  <div className="no-results">
                    <div
                      className={`text-center py-5 ${isDarkMode ? 'text-light' : 'text-muted'}`}
                    >
                      <h4>No products found</h4>
                      <p>Try searching with different keywords or check your spelling</p>
                      <button
                        className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-primary'}`}
                        onClick={() => {
                          setCurrentQuery('');
                          setCurrentPage(1);
                        }}
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Col>
          </Row>
        </Container>

        {/* Footer */}
        <Suspense fallback={<div className="footer-skeleton"></div>}>
          <Footer isDarkMode={isDarkMode} />
        </Suspense>

        {/* Enhanced Toast Notifications */}
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <Toast isOpen={showToast} toggle={() => setShowToast(false)}>
            <ToastHeader toggle={() => setShowToast(false)}>
              Dungyzon
              {currentPage > 1 && <small className="ms-2 text-muted">Page {currentPage}</small>}
            </ToastHeader>
            <ToastBody>{toastMessage}</ToastBody>
          </Toast>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
