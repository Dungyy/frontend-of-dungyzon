import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Alert } from 'reactstrap';

// logic to dispaly stars
export const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-warning" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-warning" />);
    }
  }
  return stars;
};

// generic error message
export const ErrorMessage = ({ message, isDarkMode }) => {
  return (
    <div className="text-center ">
      <Alert color={isDarkMode ? 'danger' : 'danger'} className="text-center my-3">
        <strong>{message}</strong>
      </Alert>
    </div>
  );
};
