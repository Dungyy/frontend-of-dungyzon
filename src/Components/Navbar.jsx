import React, { useState, memo, useCallback } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from 'reactstrap';
import {
  FaSun,
  FaMoon,
  FaInfo,
  FaHistory,
  FaHeart,
  FaBars,
  FaGithub,
  FaEnvelope,
} from 'react-icons/fa';

const NavbarComponent = memo(
  ({ isDarkMode, toggleDarkMode, searchHistory = [], onHistoryItemClick = () => {} }) => {
    const [modal, setModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [historyDropdown, setHistoryDropdown] = useState(false);

    const toggleModal = useCallback(() => setModal(!modal), [modal]);
    const toggleNavbar = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    const toggleHistoryDropdown = useCallback(
      () => setHistoryDropdown(!historyDropdown),
      [historyDropdown]
    );

    const handleHistoryItemClick = useCallback(
      (item) => {
        onHistoryItemClick(item);
        setHistoryDropdown(false);
      },
      [onHistoryItemClick]
    );

    const clearHistory = useCallback(() => {
      localStorage.removeItem('dungyzon_search_history');
      setHistoryDropdown(false);
      window.location.reload(); // Simple way to update the parent component
    }, []);

    return (
      <>
        <Navbar
          color={isDarkMode ? 'dark' : 'light'}
          dark={isDarkMode}
          light={!isDarkMode}
          expand="md"
          className="navbar-custom shadow-sm"
          fixed="top"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
              : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
            borderBottom: `2px solid ${isDarkMode ? '#495057' : '#dee2e6'}`,
          }}
        >
          <NavbarBrand
            href="/"
            className="navbar-brand-custom fw-bold d-flex align-items-center"
            style={{
              fontSize: '1.5rem',
              background: 'linear-gradient(45deg, #007bff, #6f42c1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🛍️ DUNGYZON
          </NavbarBrand>

          <NavbarToggler
            onClick={toggleNavbar}
            className={isDarkMode ? 'navbar-toggler-dark' : ''}
          >
            <FaBars />
          </NavbarToggler>

          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              {/* Search History Dropdown */}
              {searchHistory.length > 0 && (
                <NavItem>
                  <Dropdown
                    isOpen={historyDropdown}
                    toggle={toggleHistoryDropdown}
                    direction="down"
                  >
                    <DropdownToggle
                      nav
                      caret
                      className={`nav-link-custom ${isDarkMode ? 'text-light' : 'text-dark'}`}
                    >
                      <FaHistory className="me-1" />
                      History
                      {searchHistory.length > 0 && (
                        <Badge color="primary" pill size="sm" className="ms-1">
                          {searchHistory.length}
                        </Badge>
                      )}
                    </DropdownToggle>
                    <DropdownMenu
                      className={isDarkMode ? 'dropdown-menu-dark' : ''}
                      style={{ minWidth: '250px' }}
                    >
                      <DropdownItem header>Recent Searches</DropdownItem>
                      {searchHistory.slice(0, 5).map((item, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => handleHistoryItemClick(item)}
                          className="d-flex align-items-center"
                        >
                          <FaHistory className="me-2 text-muted" size="0.8em" />
                          <span className="text-truncate">{item}</span>
                        </DropdownItem>
                      ))}
                      {searchHistory.length > 5 && <DropdownItem divider />}
                      <DropdownItem onClick={clearHistory} className="text-danger">
                        Clear History
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavItem>
              )}

              {/* Favorites Link */}
              <NavItem>
                <NavLink
                  href="#"
                  className={`nav-link-custom ${isDarkMode ? 'text-light' : 'text-dark'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to favorites page
                  }}
                >
                  <FaHeart className="me-1" />
                  Favorites
                </NavLink>
              </NavItem>
            </Nav>

            <Nav navbar>
              {/* Dark Mode Toggle */}
              <NavItem>
                <NavLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDarkMode();
                  }}
                  className={`nav-link-custom ${isDarkMode ? 'text-light' : 'text-dark'}`}
                  title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                  {isDarkMode ? (
                    <>
                      <FaSun className="me-1" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon className="me-1" />
                      Dark Mode
                    </>
                  )}
                </NavLink>
              </NavItem>

              {/* About Modal */}
              <NavItem>
                <NavLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleModal();
                  }}
                  className={`nav-link-custom ${isDarkMode ? 'text-light' : 'text-dark'}`}
                >
                  <FaInfo className="me-1" />
                  About
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        {/* Enhanced About Modal */}
        <Modal
          isOpen={modal}
          toggle={toggleModal}
          size="lg"
          className={isDarkMode ? 'modal-dark' : ''}
        >
          <ModalHeader
            toggle={toggleModal}
            className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
          >
            <div className="d-flex align-items-center">
              <span className="me-2">🛍️</span>
              What is Dungyzon?
            </div>
          </ModalHeader>

          <ModalBody className={isDarkMode ? 'bg-dark text-light' : ''}>
            <div className="about-content">
              <div className="text-center mb-4">
                <h4 className="text-primary">Your Smart Shopping Assistant</h4>
              </div>

              <p className="lead">
                Dungyzon is your reliable companion for Amazon product searches, powered by
                intelligent web scraping technology that delivers comprehensive product information
                in real-time.
              </p>

              <div className="features-grid row g-3 my-4">
                <div className="col-md-6">
                  <div
                    className={`feature-card p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                  >
                    <h6 className="text-primary">⚡ Fast Search</h6>
                    <p className="mb-0 small">
                      Get instant results with our optimized search engine
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className={`feature-card p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                  >
                    <h6 className="text-success">📊 Real-time Data</h6>
                    <p className="mb-0 small">Live prices, reviews, and availability updates</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className={`feature-card p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                  >
                    <h6 className="text-info">🎯 Smart Filters</h6>
                    <p className="mb-0 small">Advanced filtering and sorting options</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className={`feature-card p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                  >
                    <h6 className="text-warning">💝 Favorites</h6>
                    <p className="mb-0 small">Save and track your favorite products</p>
                  </div>
                </div>
              </div>

              <hr className={isDarkMode ? 'border-secondary' : ''} />

              <div className="text-center">
                <p className="mb-3">
                  <strong>
                    Think of it as your hassle-free shortcut to Amazon&#39;s vast catalog.
                  </strong>
                </p>
                <p className="text-muted">
                  Less time searching, more time finding exactly what you need! 🎯
                </p>
              </div>

              {/* Social Links */}
              <div className="social-links text-center mt-4">
                <h6>Connect with us:</h6>
                <div className="d-flex justify-content-center gap-3">
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => window.open('https://github.com/Dungyy', '_blank')}
                  >
                    <FaGithub size="1.2em" />
                  </Button>
                  <Button
                    color="link"
                    size="sm"
                    onClick={() => window.open('mailto:contact@dungyzon.com')}
                  >
                    <FaEnvelope size="1.2em" />
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className={isDarkMode ? 'bg-dark border-secondary' : ''}>
            <div className="d-flex justify-content-between w-100">
              <small className={`text-muted align-self-center`}>
                Version 2.0.0 - Enhanced Edition
              </small>
              <Button color={isDarkMode ? 'outline-light' : 'primary'} onClick={toggleModal}>
                Get Started
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
);

NavbarComponent.displayName = 'NavbarComponent';

export default NavbarComponent;
