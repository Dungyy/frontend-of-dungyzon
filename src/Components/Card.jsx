import React, { useState } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import { FaThumbsUp } from 'react-icons/fa';

const ProductCard = ({ result, isDarkMode }) => {
  // State to handle hover effect on the title
  const [isHovering, setIsHovering] = useState(false);

  // Function to handle mouse enter event on the title
  const handleMouseEnter = () => setIsHovering(true);

  // Function to handle mouse leave event on the title
  const handleMouseLeave = () => setIsHovering(false);

  // Function to truncate the title
  const truncateTitle = (title) => {
    return title.length > 50 ? `${title.substring(0, 50)}...` : title;
  };

  return (
    <div className="card-column" key={result.position}>
      <Card className="card text-center">
        {' '}
        {/* Add text-center to Card */}
        <CardImg top src={result.image} alt={result.name} className="card-img-top" />
        <CardBody>
          <CardTitle
            tag="h5"
            className="card-title"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {isHovering ? result.name : truncateTitle(result.name)}
          </CardTitle>
          <CardSubtitle tag="h4" className="mb-2 card-subtitle">
            Price: <span style={{ color: 'green' }}>{result.price_string}</span>
          </CardSubtitle>
          {/* Stars and reviews */}
          {result.stars && (
            <div className="card-stars mb-2">
              {' '}
              {/* Wrapped in div with class mb-2 for spacing */}
              Stars: {result.stars}{' '}
              {result.stars > 4.5 ? '⭐️⭐️⭐️⭐️⭐️' : '⭐️'.repeat(Math.floor(result.stars))}
            </div>
          )}
          <div className="card-reviews mb-2">
            {' '}
            {/* Wrapped in div with class mb-2 for spacing */}
            Total Reviews: {result.total_reviews}
            {result.is_best_seller && (
              <p className="best-seller">
                Best Seller <FaThumbsUp className="fa-thumbs-up" />
              </p>
            )}
            {result.has_prime && <p className="prime-available">Prime available!</p>}
            {result.is_amazon_choice && (
              <p className="amazon-choice">
                Amazon Choice <FaThumbsUp className="fa-thumbs-up" />
              </p>
            )}
            {result.is_limited_deal && (
              <p className="limited-deal">
                Limited Deal <FaThumbsUp className="fa-thumbs-up" />
              </p>
            )}
          </div>
          <Button
            className={`mt-auto ${isDarkMode ? 'dark-mode' : ''}`} // mt-auto to push the button to the bottom
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            onClick={() => window.open(result.url, '_blank')}
          >
            View on Amazon
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductCard;
