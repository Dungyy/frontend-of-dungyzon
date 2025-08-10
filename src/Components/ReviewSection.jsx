import React, { memo, useState, useCallback } from 'react';
import { Card, CardBody, Badge, Button, Collapse } from 'reactstrap';
import { FaThumbsUp, FaThumbsDown, FaExpand, FaCompress } from 'react-icons/fa';
import { renderStars } from './utils/utils';

const ReviewSection = memo(({ review, type, isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (!review) {
    return (
      <Card className={`review-card ${isDarkMode ? 'bg-secondary text-light' : 'bg-light'}`}>
        <CardBody className="text-center">
          <p className="mb-0">No review available</p>
        </CardBody>
      </Card>
    );
  }

  const reviewText = review.review || review.comment || review.content || '';
  const isLongReview = reviewText.length > 200;
  const displayText =
    isExpanded || !isLongReview ? reviewText : `${reviewText.substring(0, 200)}...`;

  return (
    <Card
      className={`review-card mb-3 border-0 shadow-sm ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
      style={{ borderLeft: `4px solid ${type === 'positive' ? '#28a745' : '#dc3545'}` }}
    >
      <CardBody className="p-3">
        {/* Review Header */}
        <div className="review-header mb-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Badge
              color={type === 'positive' ? 'success' : 'danger'}
              className="review-type-badge"
            >
              {type === 'positive' ? (
                <>
                  <FaThumbsUp className="me-1" size="0.8em" />
                  Top Positive Review
                </>
              ) : (
                <>
                  <FaThumbsDown className="me-1" size="0.8em" />
                  Top Critical Review
                </>
              )}
            </Badge>

            {isLongReview && (
              <Button
                color="link"
                size="sm"
                className={`p-0 ${isDarkMode ? 'text-light' : 'text-dark'}`}
                onClick={toggleExpanded}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </Button>
            )}
          </div>

          {/* Rating and Title */}
          <div className="d-flex align-items-center mb-2">
            <div className="stars me-2">{renderStars(review.stars || review.rating || 0)}</div>
            {review.title && <h6 className="review-title mb-0 fw-bold">{review.title}</h6>}
          </div>

          {/* Reviewer Info */}
          <div className={`reviewer-info small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
            <span className="reviewer-name fw-semibold">
              {review.username || review.author || 'Anonymous'}
            </span>
            {review.date && (
              <span className="review-date ms-2">
                on {new Date(review.date).toLocaleDateString()}
              </span>
            )}
            {review.verified_purchase && (
              <Badge color="success" size="sm" className="ms-2">
                Verified Purchase
              </Badge>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="review-content">
          <p className="review-text mb-3" style={{ lineHeight: '1.6' }}>
            {displayText}
          </p>

          {isLongReview && (
            <Button
              color="link"
              size="sm"
              className={`p-0 ${isDarkMode ? 'text-info' : 'text-primary'}`}
              onClick={toggleExpanded}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="review-images mt-3">
            <div className="d-flex align-items-center mb-2">
              <small className={isDarkMode ? 'text-light' : 'text-muted'}>
                Customer Images ({review.images.length})
              </small>
              <Button
                color="link"
                size="sm"
                className={`p-0 ms-2 ${isDarkMode ? 'text-info' : 'text-primary'}`}
                onClick={() => setShowImages(!showImages)}
              >
                {showImages ? 'Hide' : 'Show'}
              </Button>
            </div>
            <Collapse isOpen={showImages}>
              <div className="row g-2">
                {review.images.map((img, index) => (
                  <div key={index} className="col-auto">
                    <img
                      src={img}
                      alt={`Review image ${index + 1}`}
                      className="review-image rounded"
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => window.open(img, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        )}

        {/* Manufacturer Reply */}
        {review.manufacturer_replied && review.manufacturer_reply && (
          <div
            className={`manufacturer-reply mt-3 p-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
          >
            <div className="d-flex align-items-center mb-2">
              <Badge color="info" size="sm">
                Manufacturer Response
              </Badge>
            </div>
            <p className="mb-0 small">{review.manufacturer_reply}</p>
          </div>
        )}

        {/* Helpful Actions */}
        {review.helpful_count && (
          <div className="review-actions mt-3 pt-2 border-top">
            <small className={`${isDarkMode ? 'text-light' : 'text-muted'}`}>
              {review.helpful_count} people found this helpful
            </small>
          </div>
        )}
      </CardBody>
    </Card>
  );
});

ReviewSection.displayName = 'ReviewSection';

export default ReviewSection;
