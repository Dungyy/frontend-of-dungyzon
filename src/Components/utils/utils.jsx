// utils/utils.js - Fixed version compatible with your existing code
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Alert } from 'reactstrap';

// FIXED: Simple star rendering function (no memo wrapper for compatibility)
export const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= numericRating) {
      stars.push(<FaStar key={i} className="text-warning" />);
    } else if (i - 0.5 <= numericRating) {
      stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-warning" />);
    }
  }
  return stars;
};

// FIXED: Simple error message component (no memo wrapper for compatibility)
export const ErrorMessage = ({ message, isDarkMode }) => {
  return (
    <div className="text-center">
      <Alert color={isDarkMode ? 'danger' : 'danger'} className="text-center my-3">
        <strong>{message}</strong>
      </Alert>
    </div>
  );
};

// Enhanced star rendering with options (optional upgrade)
export const renderStarsAdvanced = (rating, options = {}) => {
  const { size = '1em', showValue = false, interactive = false, onRatingChange = null } = options;

  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    let starComponent;

    if (i <= numericRating) {
      starComponent = (
        <FaStar
          key={i}
          className="text-warning star-icon"
          style={{ fontSize: size, cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? () => onRatingChange?.(i) : undefined}
        />
      );
    } else if (i - 0.5 <= numericRating) {
      starComponent = (
        <FaStarHalfAlt
          key={i}
          className="text-warning star-icon"
          style={{ fontSize: size, cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? () => onRatingChange?.(i) : undefined}
        />
      );
    } else {
      starComponent = (
        <FaRegStar
          key={i}
          className="text-warning star-icon"
          style={{ fontSize: size, cursor: interactive ? 'pointer' : 'default' }}
          onClick={interactive ? () => onRatingChange?.(i) : undefined}
        />
      );
    }

    stars.push(starComponent);
  }

  return (
    <div className="stars-container d-inline-flex align-items-center">
      <div className="stars">{stars}</div>
      {showValue && (
        <span className="rating-value ms-2 small text-muted">{numericRating.toFixed(1)}</span>
      )}
    </div>
  );
};

// Enhanced error message component (optional upgrade)
export const ErrorMessageAdvanced = ({
  message,
  isDarkMode,
  type = 'error',
  dismissible = false,
  onDismiss = null,
  action = null,
  className = '',
}) => {
  const getAlertColor = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'danger';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-message-container text-center ${className}`}>
      <Alert
        color={getAlertColor()}
        isOpen={true}
        toggle={dismissible ? onDismiss : undefined}
        className={`${isDarkMode ? 'alert-dark' : ''} d-flex align-items-center justify-content-between`}
      >
        <div className="d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.2em' }}>
            {getIcon()}
          </span>
          <div>
            <strong>{message}</strong>
            {action && <div className="mt-2">{action}</div>}
          </div>
        </div>
      </Alert>
    </div>
  );
};

// Utility functions that you can gradually adopt
export const formatPrice = (price) => {
  if (!price) return 'Price not available';

  if (typeof price === 'string') {
    if (price.includes('$') || price.includes('€') || price.includes('£')) {
      return price;
    }
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      return `$${numPrice.toFixed(2)}`;
    }
  }

  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`;
  }

  return price;
};

export const formatReviewCount = (count) => {
  if (!count) return '0';

  const num = parseInt(count);
  if (isNaN(num)) return count;

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }

  return num.toLocaleString();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const validateSearchTerm = (term) => {
  if (!term || typeof term !== 'string') {
    return { isValid: false, message: 'Please enter a search term' };
  }

  const cleanTerm = term.trim();

  if (cleanTerm.length < 2) {
    return { isValid: false, message: 'Search term must be at least 2 characters long' };
  }

  if (cleanTerm.length > 100) {
    return { isValid: false, message: 'Search term is too long (max 100 characters)' };
  }

  return { isValid: true, term: cleanTerm };
};

// Simple debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },
};

// Constants for your app
export const STORAGE_KEYS = {
  DARK_MODE: 'dungyzon_dark_mode',
  SEARCH_HISTORY: 'dungyzon_search_history',
  FAVORITES: 'dungyzon_favorites',
  LAST_SEARCH: 'dungyzon_last_search',
};

// Default export for backwards compatibility
export default {
  renderStars,
  ErrorMessage,
  formatPrice,
  formatReviewCount,
  truncateText,
  validateSearchTerm,
  debounce,
  storage,
  STORAGE_KEYS,
};
