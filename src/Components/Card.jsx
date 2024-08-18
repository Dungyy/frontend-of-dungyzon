import React, { useState } from 'react';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FaThumbsUp } from 'react-icons/fa';
import { URL } from '../global';
import axios from 'axios';
import { SpinnerDiamond } from 'spinners-react';
import ReviewSection from './ReviewSection';
import { renderStars, ErrorMessage } from './utils/utils';

const ProductCard = ({ result, isDarkMode }) => {
  // State to handle hover effect on the title
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTitleClick = () => setShowFullTitle(!showFullTitle);

  const handleViewDetails = async () => {
    setModalOpen(true);
    if (!productDetails) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${URL}/products/${result.asin}/quick`);
        setProductDetails(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching product details.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const truncateTitle = (title) => {
    return title.length > 50 ? `${title.substring(0, 50)}...` : title;
  };

  return (
    <div className={`card-column mb-4 ${isDarkMode ? 'bg-dark' : ''}`} key={result.position}>
      <Card className={`card text-center h-100 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <CardImg
          top
          src={result.image}
          alt={result.name}
          className="card-img-top img-fluid p-3"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <CardBody className="d-flex flex-column p-md-3 p-2">
          <CardTitle
            tag="h5"
            className="card-title mb-2"
            onClick={handleTitleClick}
            style={{ cursor: 'pointer' }}
            title={result.name}
          >
            {showFullTitle ? result.name : truncateTitle(result.name)}
          </CardTitle>
          <CardSubtitle tag="h4" className="mb-2 text-success">
            {result.price_string}
          </CardSubtitle>
          <div className="mb-2 d-flex justify-content-center align-items-center">
            {renderStars(result.stars)}
            <span className="ml-2">({result.total_reviews || 0})</span>
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
            className={`mt-2 w-100 ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            className={`mt-2 w-100 ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            // eslint-disable-next-line no-undef
            onClick={() => window.open(result.url, '_blank')}
          >
            View on Amazon
          </Button>
        </CardBody>
      </Card>

      {/* Modal for details */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="lg">
        <ModalHeader
          toggle={() => setModalOpen(false)}
          className={isDarkMode ? 'bg-dark text-light' : ''}
        >
          {result.name}
        </ModalHeader>
        <ModalBody className={isDarkMode ? 'bg-dark text-light' : ''}>
          {isLoading && (
            <div className="text-center">
              {' '}
              <SpinnerDiamond
                size={200}
                thickness={199}
                speed={100}
                color="#4b69f0"
                secondaryColor="grey"
              />
            </div>
          )}
          {error && (
            <ErrorMessage
              message="Error with detail info, Please try at a later time"
              isDarkMode={isDarkMode}
            />
          )}
          {productDetails && (
            <div>
              <div className="modal-product-details">
                <div className="modal-product-image">
                  <CardImg
                    src={result.image}
                    alt={result.name}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <div className="modal-product-info">
                  {/* <h4 className="modal-product-title">{result.name}</h4> */}
                  <p className="modal-product-price text-success">{result.price_string}</p>
                  <div className="d-flex align-items-center justify-content-end">
                    {renderStars(result.stars)}
                    <span className="ml-2">({result.total_reviews} reviews)</span>
                  </div>
                  {result.is_best_seller && (
                    <div className="text-primary mt-2">
                      <FaThumbsUp className="mr-1" /> Best Seller
                    </div>
                  )}
                  {result.has_prime && <div className="text-info mt-2">Prime available!</div>}
                  {result.is_amazon_choice && (
                    <div className="text-warning mt-2">
                      <FaThumbsUp className="mr-1" /> Amazon&apos;s Choice
                    </div>
                  )}
                  {result.is_limited_deal && (
                    <div className="text-success mt-2">
                      <FaThumbsUp className="mr-1" /> Limited Deal
                    </div>
                  )}
                </div>
              </div>
              <hr className={isDarkMode ? 'bg-light' : ''} />
              <h5 className="mb-3">Customer Reviews</h5>
              {productDetails.topPositiveReview && productDetails.topCriticalReview ? (
                <>
                  <ReviewSection
                    review={productDetails.topPositiveReview}
                    type="positive"
                    isDarkMode={isDarkMode}
                  />
                  <ReviewSection
                    review={productDetails.topCriticalReview}
                    type="critical"
                    isDarkMode={isDarkMode}
                  />
                </>
              ) : (
                <ErrorMessage
                  message="Top rated reviews not found at this time, Please try at a later time"
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter className={isDarkMode ? 'bg-dark' : ''}>
          <Button
            className={`${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            // eslint-disable-next-line no-undef
            onClick={() => window.open(result.url, '_blank')}
          >
            View on Amazon
          </Button>
          <Button
            className={`${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProductCard;
