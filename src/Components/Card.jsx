// Enhanced ProductCard.js - Updated Modal Section to show all schema data
import React, { useState, useCallback } from 'react';
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
  Badge,
  Alert,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Progress,
  Table,
} from 'reactstrap';
import {
  FaThumbsUp,
  FaHeart,
  FaRegHeart,
  FaEye,
  FaAmazon,
  FaShippingFast,
  FaTruck,
  FaBoxOpen,
  FaStar,
} from 'react-icons/fa';
import { URL } from '../global';
import axios from 'axios';
import { SpinnerDiamond } from 'spinners-react';
import ReviewSection from './ReviewSection';
import { renderStars, ErrorMessage } from './utils/utils';

const ProductCard = ({ result, isDarkMode, lazyLoad = false }) => {
  // State management (keeping existing state)
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Keep all existing useEffect and handler functions unchanged...
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('dungyzon_favorites') || '[]');
    setIsFavorite(favorites.some((fav) => fav.id === result.asin));
  }, [result.asin]);

  const handleTitleClick = useCallback(() => {
    setShowFullTitle((prev) => !prev);
  }, []);

  const truncateTitle = useCallback((title, maxLength = 60) => {
    if (!title) return 'Unknown Product';
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  }, []);

  const toggleFavorite = useCallback(
    (e) => {
      e.stopPropagation();
      const favorites = JSON.parse(localStorage.getItem('dungyzon_favorites') || '[]');
      if (!isFavorite) {
        const newFavorite = {
          id: result.asin,
          name: result.name,
          image: result.image,
          price: result.price_string,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        localStorage.setItem('dungyzon_favorites', JSON.stringify(favorites));
        setIsFavorite(true);
      } else {
        const filtered = favorites.filter((fav) => fav.id !== result.asin);
        localStorage.setItem('dungyzon_favorites', JSON.stringify(filtered));
        setIsFavorite(false);
      }
    },
    [isFavorite, result]
  );

  const handleViewDetails = useCallback(async () => {
    setModalOpen(true);
    if (!productDetails && result.asin) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${URL}/products/${result.asin}`, {
          timeout: 1000000,
        });
        if (response.data) {
          setProductDetails(response.data);
        } else {
          throw new Error('No product details found');
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to fetch product details';
        setError(errorMessage);
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [productDetails, result.asin]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle image selection for gallery
  const handleImageSelect = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  // Reset selected image when modal opens
  const handleModalOpen = useCallback(async () => {
    setSelectedImageIndex(0); // Reset to first image
    await handleViewDetails();
  }, [handleViewDetails]);

  // Helper function to format star percentages
  const formatPercentage = (percentage) => {
    return percentage ? `${percentage}%` : '0%';
  };

  // Helper function to render customer insights
  const renderCustomerInsights = (customersSay) => {
    if (!customersSay) return null;

    return (
      <div className="customer-insights mb-4">
        <h6 className="fw-bold mb-3">What Customers Say</h6>
        <p className="mb-3">{customersSay.summary}</p>

        {customersSay.select_to_learn_more && (
          <div className="insights-breakdown">
            <h6 className="fw-bold mb-2">Customer Feedback Breakdown</h6>
            {Object.entries(customersSay.select_to_learn_more).map(([category, data]) => (
              <div key={category} className="mb-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold">{category}</span>
                  <small className="text-muted">
                    {data.positive}/{data.total} positive (
                    {Math.round((data.positive / data.total) * 100)}%)
                  </small>
                </div>
                <Progress
                  value={(data.positive / data.total) * 100}
                  color="success"
                  className="mb-1"
                  style={{ height: '6px' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`card-column mb-4 ${isDarkMode ? 'bg-dark' : ''}`} key={result.position}>
      {/* Keep existing Card component unchanged */}
      <Card
        className={`card text-center h-100 ${isDarkMode ? 'bg-dark text-light' : ''} product-card-enhanced`}
        style={{
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={handleModalOpen}
      >
        {/* Keep existing image and card body sections unchanged */}
        <div className="card-image-container position-relative">
          {result.image && !imageError ? (
            <CardImg
              top
              src={result.image}
              alt={result.name}
              className="card-img-top img-fluid p-3"
              style={{
                height: '220px',
                objectFit: 'contain',
                backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa',
              }}
              onError={handleImageError}
              loading={lazyLoad ? 'lazy' : 'eager'}
            />
          ) : (
            <div
              className={`no-image-placeholder d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
              style={{ height: '220px', margin: '1rem' }}
            >
              <span className="text-muted">📦 No Image</span>
            </div>
          )}

          <div className="card-actions position-absolute top-0 end-0 p-2" style={{ zIndex: 2 }}>
            <Button
              color="link"
              size="lg"
              className={`p-1 me-1 ${isDarkMode ? 'text-light' : 'text-dark'}`}
              onClick={toggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{ background: 'rgba(0, 0, 0, 0)', borderRadius: '50%' }}
            >
              {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
            </Button>
          </div>
        </div>

        <CardBody className="d-flex flex-column p-md-3 p-2">
          <CardTitle
            tag="h5"
            className="card-title mb-2 flex-grow-1"
            onClick={(e) => {
              e.stopPropagation();
              handleTitleClick();
            }}
            style={{
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: '1.3',
              minHeight: '3rem',
            }}
            title={result.name}
          >
            {showFullTitle ? result.name : truncateTitle(result.name)}
          </CardTitle>

          <CardSubtitle
            tag="h4"
            className="mb-2 fw-bold"
            style={{ color: isDarkMode ? '#28a745' : '#198754' }}
          >
            {result.price_string}
          </CardSubtitle>

          <div className="mb-2 d-flex justify-content-center align-items-center">
            {renderStars(result.stars)}
            <span className="ms-2">({result.total_reviews || 0})</span>
          </div>

          <div className="product-badges mb-2">
            {result.is_best_seller && (
              <Badge color="primary" className="me-1 mb-1">
                <FaThumbsUp className="me-1" size="0.8em" />
                Best Seller
              </Badge>
            )}
            {result.has_prime && (
              <Badge color="info" className="me-1 mb-1">
                Prime
              </Badge>
            )}
            {result.is_amazon_choice && (
              <Badge color="warning" className="me-1 mb-1">
                <FaAmazon className="me-1" size="0.8em" />
                Choice
              </Badge>
            )}
            {result.is_limited_deal && (
              <Badge color="success" className="me-1 mb-1">
                Limited Deal
              </Badge>
            )}
          </div>

          <div className="mt-auto">
            <Button
              className="mb-2 w-100"
              color={isDarkMode ? 'outline-light' : 'outline-primary'}
              onClick={(e) => {
                e.stopPropagation();
                handleModalOpen();
              }}
            >
              <FaEye className="me-2" />
              View Details
            </Button>

            <Button
              className="w-100"
              color={isDarkMode ? 'outline-info' : 'outline-success'}
              onClick={(e) => {
                e.stopPropagation();
                window.open(result.url, '_blank', 'noopener,noreferrer');
              }}
            >
              <FaAmazon className="me-2" />
              View on Amazon
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* ENHANCED MODAL with all schema data */}
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        size="xl"
        className={isDarkMode ? 'modal-dark' : ''}
      >
        <ModalHeader
          toggle={() => setModalOpen(false)}
          className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <span className="me-2">{result.name}</span>
            <Button
              color="link"
              size="sm"
              className="p-0"
              onClick={toggleFavorite}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
            </Button>
          </div>
        </ModalHeader>

        <ModalBody
          className={isDarkMode ? 'bg-dark text-light' : ''}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {isLoading && (
            <div className="text-center py-4">
              <SpinnerDiamond
                size={120}
                thickness={180}
                speed={100}
                color={isDarkMode ? '#4b69f0' : '#007bff'}
                secondaryColor={isDarkMode ? '#333' : '#e9ecef'}
              />
              <p className="mt-3">Loading product details...</p>
            </div>
          )}

          {error && (
            <Alert color="danger" className="mb-3">
              <strong>Error:</strong> {error}
              <Button color="link" size="sm" className="ms-2" onClick={handleViewDetails}>
                Retry
              </Button>
            </Alert>
          )}

          {productDetails && !isLoading && (
            <div>
              {/* Main Product Info */}
              <Row className="mb-4">
                <Col md={5}>
                  <div className="product-images">
                    {productDetails.details.images && productDetails.details.images.length > 0 ? (
                      <div>
                        {/* Main Selected Image */}
                        <div className="main-image-container mb-3">
                          <img
                            src={productDetails.details.images[selectedImageIndex]}
                            alt={`${productDetails.details.name} - Image ${selectedImageIndex + 1}`}
                            className="img-fluid rounded"
                            style={{
                              width: '100%',
                              maxHeight: '400px',
                              objectFit: 'contain',
                              cursor: 'pointer',
                              border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
                            }}
                            onClick={() => {
                              // Optional: Open image in new tab for full view
                              window.open(
                                productDetails.details.images[selectedImageIndex],
                                '_blank'
                              );
                            }}
                          />
                        </div>

                        {/* Image Thumbnails Gallery */}
                        {productDetails.details.images.length > 1 && (
                          <div className="image-thumbnails">
                            <small className="text-muted mb-2 d-block">
                              Click to view different images ({selectedImageIndex + 1} of{' '}
                              {productDetails.details.images.length})
                            </small>
                            <div className="d-flex flex-wrap gap-2">
                              {productDetails.details.images.map((img, index) => (
                                <div
                                  key={index}
                                  className={`thumbnail-container ${selectedImageIndex === index ? 'selected' : ''}`}
                                  style={{
                                    border:
                                      selectedImageIndex === index
                                        ? '3px solid #007bff'
                                        : isDarkMode
                                          ? '1px solid #555'
                                          : '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '2px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    transform:
                                      selectedImageIndex === index ? 'scale(1.05)' : 'scale(1)',
                                  }}
                                  onClick={() => handleImageSelect(index)}
                                  onMouseEnter={(e) => {
                                    if (selectedImageIndex !== index) {
                                      e.target.style.transform = 'scale(1.02)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (selectedImageIndex !== index) {
                                      e.target.style.transform = 'scale(1)';
                                    }
                                  }}
                                >
                                  <img
                                    src={img}
                                    alt={`${productDetails.details.name} thumbnail ${index + 1}`}
                                    className="img-thumbnail"
                                    style={{
                                      width: '80px',
                                      height: '80px',
                                      objectFit: 'contain',
                                      border: 'none',
                                      backgroundColor: isDarkMode ? '#2d2d2d' : '#f8f9fa',
                                    }}
                                  />
                                  {selectedImageIndex === index && (
                                    <div
                                      className="position-absolute top-0 start-0 bg-primary text-white"
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transform: 'translate(-8px, -8px)',
                                      }}
                                    >
                                      ✓
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`no-image-placeholder d-flex align-items-center justify-content-center rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                        style={{ height: '300px' }}
                      >
                        <span className="text-muted">📦 No Image Available</span>
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={7}>
                  {/* Pricing and Availability */}
                  <div className="pricing-section mb-4">
                    <h3 className="text-success fw-bold mb-2">{productDetails.details.pricing}</h3>

                    {productDetails.details.shipping_price && (
                      <div className="shipping-info mb-3">
                        <Badge color="success" className="me-2">
                          <FaShippingFast className="me-1" />
                          {productDetails.details.shipping_price} Shipping
                        </Badge>
                        {productDetails.details.shipping_time && (
                          <Badge color="info">
                            <FaTruck className="me-1" />
                            Arrives {productDetails.details.shipping_time}
                          </Badge>
                        )}
                      </div>
                    )}

                    {productDetails.details.availability_status && (
                      <Alert color="warning" className="py-2">
                        <FaBoxOpen className="me-2" />
                        {productDetails.details.availability_status}
                      </Alert>
                    )}
                  </div>

                  {/* Rating Breakdown */}
                  <div className="rating-section mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <h4 className="mb-0">{productDetails.details.average_rating}</h4>
                        <div>{renderStars(productDetails.details.average_rating)}</div>
                      </div>
                      <div className="flex-grow-1">
                        <small className="text-muted">
                          {productDetails.details.total_ratings?.toLocaleString()} total ratings
                        </small>
                      </div>
                    </div>

                    {/* Star Rating Breakdown */}
                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = productDetails.details[`${star}_star_percentage`];
                        return (
                          <div key={star} className="d-flex align-items-center mb-1">
                            <span className="me-2 text-nowrap" style={{ minWidth: '60px' }}>
                              {star} <FaStar className="text-warning" size="0.8em" />
                            </span>
                            <Progress
                              value={percentage || 0}
                              className="flex-grow-1 me-2"
                              color="warning"
                              style={{ height: '8px' }}
                            />
                            <span className="text-muted" style={{ minWidth: '35px' }}>
                              {formatPercentage(percentage)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Badges */}
                  <div className="product-badges-modal mb-3">
                    {result.is_best_seller && (
                      <Badge color="primary" className="me-2 mb-2">
                        <FaThumbsUp className="me-1" /> Best Seller
                      </Badge>
                    )}
                    {result.has_prime && (
                      <Badge color="info" className="me-2 mb-2">
                        Prime Available
                      </Badge>
                    )}
                    {result.is_amazon_choice && (
                      <Badge color="warning" className="me-2 mb-2">
                        <FaAmazon className="me-1" /> Amazon&apos;s Choice
                      </Badge>
                    )}
                    {productDetails.details.is_coupon_exists && (
                      <Badge color="success" className="me-2 mb-2">
                        Coupon Available
                      </Badge>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Product Description and Features */}
              <Row className="mb-4">
                <Col md={12}>
                  {productDetails.details.full_description && (
                    <div className="description-section mb-4">
                      <h5 className="fw-bold mb-3">Product Description</h5>
                      <p className="mb-3">{productDetails.details.full_description}</p>
                    </div>
                  )}

                  {productDetails.details.feature_bullets &&
                    productDetails.details.feature_bullets.length > 0 && (
                      <div className="features-section mb-4">
                        <h5 className="fw-bold mb-3">Key Features</h5>
                        <ListGroup flush>
                          {productDetails.details.feature_bullets.map((feature, index) => (
                            <ListGroupItem
                              key={index}
                              className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                            >
                              <FaThumbsUp className="me-2 text-success" size="0.8em" />
                              {feature}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </div>
                    )}
                </Col>
              </Row>

              {/* Product Information Table */}
              {productDetails.details.product_information && (
                <Row className="mb-4">
                  <Col md={12}>
                    <h5 className="fw-bold mb-3">Product Information</h5>
                    <Table responsive striped className={isDarkMode ? 'table-dark' : ''}>
                      <tbody>
                        {Object.entries(productDetails.details.product_information).map(
                          ([key, value]) => {
                            if (key === 'Customer Reviews' || key === 'Best Sellers Rank')
                              return null;
                            return (
                              <tr key={key}>
                                <td className="fw-semibold" style={{ width: '30%' }}>
                                  {key}
                                </td>
                                <td>
                                  {typeof value === 'object' ? JSON.stringify(value) : value}
                                </td>
                              </tr>
                            );
                          }
                        )}
                        {productDetails.details.model && (
                          <tr>
                            <td className="fw-semibold">Model Number</td>
                            <td>{productDetails.details.model}</td>
                          </tr>
                        )}
                        {productDetails.details.product_category && (
                          <tr>
                            <td className="fw-semibold">Category</td>
                            <td>{productDetails.details.product_category}</td>
                          </tr>
                        )}
                        {productDetails.details.ships_from && (
                          <tr>
                            <td className="fw-semibold">Ships From</td>
                            <td>{productDetails.details.ships_from}</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}

              {/* Customer Insights */}
              {productDetails.details.customers_say && (
                <Row className="mb-4">
                  <Col md={12}>{renderCustomerInsights(productDetails.details.customers_say)}</Col>
                </Row>
              )}

              {/* Best Sellers Rank */}
              {productDetails.details.product_information?.['Best Sellers Rank'] && (
                <Row className="mb-4">
                  <Col md={12}>
                    <h5 className="fw-bold mb-3">Best Sellers Rank</h5>
                    <ListGroup>
                      {productDetails.details.product_information['Best Sellers Rank'].map(
                        (rank, index) => (
                          <ListGroupItem
                            key={index}
                            className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                          >
                            <FaThumbsUp className="me-2 text-warning" />
                            {rank}
                          </ListGroupItem>
                        )
                      )}
                    </ListGroup>
                  </Col>
                </Row>
              )}

              <hr className={isDarkMode ? 'border-secondary' : ''} />

              {/* Reviews Section */}
              <h5 className="mb-3">Customer Reviews</h5>
              {productDetails.topPositiveReview && productDetails.topCriticalReview ? (
                <Row>
                  <Col md={6}>
                    <ReviewSection
                      review={productDetails.topPositiveReview}
                      type="positive"
                      isDarkMode={isDarkMode}
                    />
                  </Col>
                  <Col md={6}>
                    <ReviewSection
                      review={productDetails.topCriticalReview}
                      type="critical"
                      isDarkMode={isDarkMode}
                    />
                  </Col>
                </Row>
              ) : productDetails.details.reviews && productDetails.details.reviews.length > 0 ? (
                <div className="recent-reviews">
                  <h6 className="mb-3">Recent Reviews</h6>
                  {productDetails.details.reviews.slice(0, 3).map((review, index) => (
                    <div
                      key={index}
                      className={`review-item p-3 mb-3 rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <div className="mb-1">{renderStars(review.stars)}</div>
                          <strong>
                            {review.title?.replace(/^\d+\.\d+\s+out\s+of\s+\d+\s+stars\s*/, '') ||
                              'Review'}
                          </strong>
                        </div>
                        <small className="text-muted">{review.date}</small>
                      </div>
                      <p className="mb-2">{review.review}</p>
                      <small className="text-muted">By {review.username}</small>
                      {review.verified_purchase && (
                        <Badge color="success" size="sm" className="ms-2">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ErrorMessage
                  message="Reviews not available at this time"
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter className={isDarkMode ? 'bg-dark border-secondary' : ''}>
          <Button
            color={isDarkMode ? 'outline-info' : 'primary'}
            onClick={() => window.open(result.url, '_blank', 'noopener,noreferrer')}
          >
            <FaAmazon className="me-2" />
            View on Amazon
          </Button>
          <Button
            color={isDarkMode ? 'outline-light' : 'secondary'}
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
