import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Form, FormGroup, Input, Button, InputGroup, Badge } from 'reactstrap';
import { FaSearch, FaTimes, FaHistory, FaMicrophone } from 'react-icons/fa';

const SearchForm = memo(
  ({
    handleSubmit,
    isDarkMode,
    className = '',
    placeholder = 'Search for products...',
    suggestions = [],
    isLoading = false,
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef(null);
    const recognition = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSearchTerm(transcript);
          setIsListening(false);
        };

        recognition.current.onerror = () => {
          setIsListening(false);
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }, []);

    const onSubmit = useCallback(
      (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
          handleSubmit(searchTerm.trim());
          setShowSuggestions(false);
        }
      },
      [searchTerm, handleSubmit]
    );

    const handleInputChange = useCallback(
      (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length > 0 && suggestions.length > 0);
      },
      [suggestions.length]
    );

    const handleSuggestionClick = useCallback(
      (suggestion) => {
        setSearchTerm(suggestion);
        handleSubmit(suggestion);
        setShowSuggestions(false);
      },
      [handleSubmit]
    );

    const clearSearch = useCallback(() => {
      setSearchTerm('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }, []);

    const startVoiceSearch = useCallback(() => {
      if (recognition.current && !isListening) {
        setIsListening(true);
        recognition.current.start();
      }
    }, [isListening]);

    // Focus input on mount
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <div className={`search-form-container ${className}`}>
        <Form onSubmit={onSubmit} className="position-relative">
          <FormGroup className="mb-0">
            <InputGroup size="lg" className="search-input-group">
              <Input
                ref={inputRef}
                type="text"
                name="searchInput"
                id="searchInput"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(searchTerm.length > 0 && suggestions.length > 0)}
                className={`search-input ${isDarkMode ? 'bg-dark text-light border-secondary' : ''}`}
                style={{
                  borderRadius: '50px 0 0 50px',
                  fontSize: '1.1rem',
                  padding: '0.75rem 1rem',
                }}
                disabled={isLoading}
              />

              {/* Clear button */}
              {searchTerm && (
                <Button
                  color="link"
                  className="position-absolute"
                  style={{
                    right: recognition.current ? '120px' : '80px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    border: 'none',
                    background: 'none',
                  }}
                  onClick={clearSearch}
                  type="button"
                >
                  <FaTimes className={isDarkMode ? 'text-light' : 'text-muted'} />
                </Button>
              )}

              {/* Voice search button */}
              {recognition.current && (
                <Button
                  color="link"
                  className="position-absolute"
                  style={{
                    right: '80px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    border: 'none',
                    background: 'none',
                  }}
                  onClick={startVoiceSearch}
                  type="button"
                  disabled={isListening || isLoading}
                  title="Voice search"
                >
                  {/* <FaMicrophone
                    className={`${isListening ? 'text-danger' : isDarkMode ? 'text-light' : 'text-muted'}`}
                    style={{ animation: isListening ? 'pulse 1s infinite' : 'none' }}
                  /> */}
                </Button>
              )}

              <Button
                color={isDarkMode ? 'outline-light' : 'primary'}
                type="submit"
                disabled={!searchTerm.trim() || isLoading}
                style={{
                  borderRadius: '0 50px 50px 0',
                  padding: '0.75rem 1.5rem',
                  minWidth: '120px',
                }}
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <FaSearch className="me-2" />
                )}
                Search
              </Button>
            </InputGroup>
          </FormGroup>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className={`suggestions-dropdown position-absolute w-100 mt-1 ${isDarkMode ? 'bg-dark border-secondary' : 'bg-white'}`}
              style={{
                zIndex: 1000,
                borderRadius: '0.375rem',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                border: '1px solid',
                borderColor: isDarkMode ? '#495057' : '#dee2e6',
              }}
            >
              <div className={`p-2 border-bottom ${isDarkMode ? 'border-secondary' : ''}`}>
                <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
                  <FaHistory className="me-1" />
                  Recent searches
                </small>
              </div>
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item p-2 cursor-pointer ${isDarkMode ? 'text-light hover-bg-secondary' : 'hover-bg-light'}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDarkMode ? '#495057' : '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <FaHistory className="me-2 text-muted" size="0.8em" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </Form>

        {isListening && (
          <div className="voice-indicator mt-2 text-center">
            <Badge color="danger">
              <FaMicrophone className="me-1" />
              Listening...
            </Badge>
          </div>
        )}
      </div>
    );
  }
);

SearchForm.displayName = 'SearchForm';

export default SearchForm;
