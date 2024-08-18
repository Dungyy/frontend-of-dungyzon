import React from 'react';
import { renderStars, ErrorMessage } from './utils/utils';

const ReviewSection = ({ review, type, isDarkMode }) => {
  if (!review) {
    return <ErrorMessage message="No review found" isDarkMode={isDarkMode} />;
  }
  return (
    <div
      className={`review-section mb-4 p-3 border rounded ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}
    >
      <h5 className={`mb-3 ${type === 'positive' ? 'text-success' : 'text-danger'}`}>
        {type === 'positive' ? 'Top Positive Review' : 'Top Critical Review'}
      </h5>
      <div className="d-flex align-items-center mb-2">
        <div className="mr-2">{renderStars(review.stars)}</div>
        &nbsp;
        <strong>{review.title}</strong>
      </div>
      <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
        By{' '}
        <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer">
          <strong style={{ color: 'grey' }}>{review.username}</strong>
        </a>{' '}
        on {review.date}
        {review.verified_purchase && <span className="ml-2 text-success">Verified Purchase</span>}
      </p>

      <p>{review.review}</p>
      {review.images && review.images.length > 0 && (
        <div className="review-images mt-2">
          {review.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Review image ${index + 1}`}
              className="mr-2 mb-2"
              style={{ maxWidth: '100px', height: 'auto' }}
            />
          ))}
        </div>
      )}
      {review.images && review.images.length > 0 && (
        <div className="review-images mt-2">
          {review.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Review image ${index + 1}`}
              className="mr-2 mb-2"
              style={{ maxWidth: '100px', height: 'auto' }}
            />
          ))}
        </div>
      )}
      {review.manufacturer_replied && (
        <div className={`manufacturer-reply mt-3 p-2 ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
          <strong>Manufacturer Response:</strong>
          <p className="mb-0">{review.manufacturer_reply}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
