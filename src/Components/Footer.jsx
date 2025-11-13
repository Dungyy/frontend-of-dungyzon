import React, { memo } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaHeart, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = memo(({ isDarkMode }) => {
  return (
    <footer
      className={`footer mt-auto py-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{
        borderTop: `2px solid ${isDarkMode ? '#495057' : '#dee2e6'}`,
        background: isDarkMode
          ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
          : 'linear-gradient(135deg, #f8f9fa, #ffffff)',
      }}
    >
      <Container>
        {/* MAIN CONTENT */}
        <Row className="align-items-center">
          {/* LEFT SIDE */}
          <Col md="6" className="text-center text-md-start">
            <div className="footer-brand mb-2">
              <span className="h5 fw-bold">🛍️ Dungyzon</span>
            </div>

            <p className={`mb-2 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
              Your smart shopping assistant for Amazon products
            </p>

            <p className="mb-0">
              <small>
                Made with <FaHeart className="text-danger mx-1" /> by Dungy
              </small>
            </p>
          </Col>

          {/* RIGHT SIDE */}
          <Col md="6" className="text-center text-md-end">
            <div className="footer-links mb-3">
              <Button
                color="link"
                size="sm"
                className={`${isDarkMode ? 'text-light' : 'text-dark'} me-2`}
                onClick={() => window.open('https://github.com/Dungyy', '_blank')}
                title="GitHub"
              >
                <FaGithub size="1.2em" />
              </Button>

              <Button
                color="link"
                size="sm"
                className={`${isDarkMode ? 'text-light' : 'text-dark'} me-2`}
                onClick={() => window.open('mailto:erick@erickmunoz.tech')}
                title="Email"
              >
                <FaEnvelope size="1.2em" />
              </Button>
            </div>
          </Col>
        </Row>

        {/* DIVIDER */}
        <hr className={`my-3 ${isDarkMode ? 'border-secondary' : 'border-light'}`} />

        {/* COPYRIGHT */}
        <Row>
          <Col className="text-center">
            <small className={isDarkMode ? 'text-light' : 'text-muted'}>
              &copy; {new Date().getFullYear()} Dungyzon
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
