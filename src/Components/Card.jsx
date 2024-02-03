import React, { useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button, Row } from 'reactstrap';
import { FaThumbsUp } from 'react-icons/fa';

const ProductCard = ({ result, isDarkMode }) => {
  // State to handle hover effect on the title
  const [isHovering, setIsHovering] = useState(false);

  // Function to handle mouse enter and click event on the title
  const handleMouseEnter = () => setIsHovering(true);
  const handleClick = () => setIsHovering(!isHovering);

  // Function to handle mouse leave event on the title
  const handleMouseLeave = () => setIsHovering(false);

  // Function to truncate the title
  const truncateTitle = (title) => {
    return title.length > 50 ? `${title.substring(0, 50)}...` : title;
  };

  // Generate stars for accessibility
  const generateStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < Math.floor(rating) ? 'filled' : ''}`}
        aria-hidden="true"
      >
        ⭐️
      </span>
    ));
  };

  return (
    <div className={`card-column mb-4 ${isDarkMode ? 'bg-dark' : ''}`} key={result.position}>
      <Card className="card text-center h-100">
        <CardImg
          top
          src={result.image}
          alt={result.name}
          className="card-img-top img-fluid p-3"
          style={{ height: '200px', objectFit: 'cover' }} // Use cover for a better fit if images are similar ratios
        />
        <CardBody className="d-flex flex-column p-3">
          <CardTitle
            tag="h5"
            className="card-title mb-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
            title={isHovering ? '' : result.name} // Tooltip for truncated text
          >
            {isHovering ? result.name : truncateTitle(result.name)}
          </CardTitle>
          <CardSubtitle tag="h4" className="mb-2 text-success">
            {result.price_string}
          </CardSubtitle>
          <div className="mb-2 d-flex justify-content-center align-items-center">
            {generateStars(result.stars)}
            <span className="ml-2">({result.total_reviews})</span>
          </div>
          {result.is_best_seller && (
            <div className="text-primary mb-1 d-flex align-items-center justify-content-center">
              Best Seller&nbsp;
              <FaThumbsUp className="ml-1" />
            </div>
          )}
          {result.has_prime && <div className="text-info mb-1">Prime available!</div>}
          {result.is_amazon_choice && (
            <div className="text-warning mb-1">
              Amazon Choice&nbsp;
              <FaThumbsUp className="ml-1" />
            </div>
          )}
          {result.is_limited_deal && (
            <div className="text-success mb-1">
              Limited Deal&nbsp;
              <FaThumbsUp className="ml-1" />
            </div>
          )}
          <Button
            className={`mt-auto ${isDarkMode ? 'dark-mode' : ''}`} // mt-auto to push the button to the bottom
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            // eslint-disable-next-line no-undef
            onClick={() => window.open(result.url, '_blank')}
          >
            View on Amazon
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const ProductGrid = ({ products, isDarkMode }) => {
  return (
    <Row>
      {products.map((product, index) => (
        <ProductCard key={index} result={product} isDarkMode={isDarkMode} />
      ))}
    </Row>
  );
};

export default ProductCard;
