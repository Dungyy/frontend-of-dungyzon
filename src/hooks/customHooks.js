import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for localStorage with JSON serialization
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial value if key doesn't exist
 * @returns {[any, function]} - [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Custom hook to track online/offline status
 * @returns {boolean} - true if online, false if offline
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Custom hook to manage document title
 * @param {string} title - title to set
 */
export const useDocumentTitle = (title) => {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title || defaultTitle.current;

    return () => {
      document.title = defaultTitle.current;
    };
  }, [title]);
};

/**
 * Custom hook for debounced values
 * @param {any} value - value to debounce
 * @param {number} delay - delay in milliseconds
 * @returns {any} - debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for intersection observer (lazy loading)
 * @param {Object} options - intersection observer options
 * @returns {[function, boolean]} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState(null);

  const setRef = useCallback((node) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '10px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, options]);

  return [setRef, isIntersecting];
};

/**
 * Custom hook for previous value
 * @param {any} value - current value
 * @returns {any} - previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * Custom hook for window size
 * @returns {Object} - {width, height, isMobile, isTablet, isDesktop}
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
};

/**
 * Custom hook for copying to clipboard
 * @returns {[function, boolean]} - [copy function, copied status]
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Clipboard API is not available.');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  return [copy, copied];
};

/**
 * Custom hook for managing async operations
 * @param {function} asyncFunction - async function to execute
 * @returns {Object} - {execute, loading, error, data}
 */
export const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, loading, error, data };
};

/**
 * Custom hook for scroll position
 * @returns {Object} - {x, y, direction}
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: null,
  });

  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollPosition({
        x: currentScrollX,
        y: currentScrollY,
        direction: currentScrollY > prevScrollY.current ? 'down' : 'up',
      });

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * Custom hook for keyboard shortcuts
 * @param {string} targetKey - key to listen for
 * @param {function} handler - function to call when key is pressed
 * @param {Object} options - modifier keys {ctrl, shift, alt, meta}
 */
export const useKeyboardShortcut = (targetKey, handler, options = {}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { ctrl = false, shift = false, alt = false, meta = false } = options;

      if (
        event.key.toLowerCase() === targetKey.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta
      ) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, handler, options]);
};

/**
 * Custom hook for form validation
 * @param {Object} initialValues - initial form values
 * @param {Object} validationRules - validation rules
 * @returns {Object} - {values, errors, handleChange, handleSubmit, isValid}
 */
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (fieldName, value) => {
      const rule = validationRules[fieldName];
      if (!rule) return '';

      if (rule.required && (!value || value.toString().trim() === '')) {
        return rule.message || `${fieldName} is required`;
      }

      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${fieldName} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${fieldName} must be less than ${rule.maxLength} characters`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${fieldName} format is invalid`;
      }

      if (rule.custom && typeof rule.custom === 'function') {
        return rule.custom(value) || '';
      }

      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (fieldName, value) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));

      const error = validate(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (onSubmit) => {
      const newErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((fieldName) => {
        const error = validate(fieldName, values[fieldName]);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);

      if (isValid && onSubmit) {
        onSubmit(values);
      }

      return isValid;
    },
    [values, validate, validationRules]
  );

  const isValid = Object.values(errors).every((error) => !error);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    isValid,
    setValues,
    setErrors,
  };
};
