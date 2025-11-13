import React, { memo, useMemo, useCallback } from 'react';
import { Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const PaginationComponent = memo(
  ({ currentPage, totalPages, handlePageChange, isDarkMode, hasMore = false, className = '' }) => {
    // Generate visible page numbers
    const visiblePages = useMemo(() => {
      const maxVisiblePages = 7;
      const pages = [];

      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Smart pagination logic
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start if we're near the end
        const adjustedStart = Math.max(1, endPage - maxVisiblePages + 1);

        for (let i = adjustedStart; i <= endPage; i++) {
          pages.push(i);
        }
      }

      return pages;
    }, [currentPage, totalPages]);

    const handlePageClick = useCallback(
      (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
          handlePageChange(page);
        }
      },
      [currentPage, totalPages, handlePageChange]
    );

    const handlePreviousPage = useCallback(() => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    }, [currentPage, handlePageChange]);

    const handleNextPage = useCallback(() => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    }, [currentPage, totalPages, handlePageChange]);

    const handleFirstPage = useCallback(() => {
      if (currentPage !== 1) {
        handlePageChange(1);
      }
    }, [currentPage, handlePageChange]);

    const handleLastPage = useCallback(() => {
      if (currentPage !== totalPages) {
        handlePageChange(totalPages);
      }
    }, [currentPage, totalPages, handlePageChange]);

    if (totalPages <= 1) {
      return null;
    }

    return (
      <Row className={`pagination-container ${className}`}>
        <Col className="d-flex justify-content-center align-items-center my-4">
          <div className="pagination-wrapper">
            {/* Page info */}
            <div className={`text-center mb-3 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
              <small>
                Page {currentPage} of {totalPages}
                {hasMore && ' (more results available)'}
              </small>
            </div>

            {/* Pagination controls */}
            <Pagination
              size="lg"
              className={`justify-content-center ${isDarkMode ? 'pagination-dark' : ''}`}
            >
              {/* First page */}
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  first
                  onClick={handleFirstPage}
                  className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                  title="First page"
                >
                  <FaAngleDoubleLeft />
                </PaginationLink>
              </PaginationItem>

              {/* Previous page */}
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={handlePreviousPage}
                  className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                  title="Previous page"
                >
                  <FaAngleLeft />
                </PaginationLink>
              </PaginationItem>

              {/* Show ellipsis if needed */}
              {visiblePages[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageClick(1)}
                      className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {visiblePages[0] > 2 && (
                    <PaginationItem disabled>
                      <PaginationLink
                        className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                      >
                        ...
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              {/* Visible page numbers */}
              {visiblePages.map((page) => (
                <PaginationItem key={page} active={currentPage === page}>
                  <PaginationLink
                    onClick={() => handlePageClick(page)}
                    className={
                      currentPage === page
                        ? 'bg-primary text-white border-primary'
                        : isDarkMode
                          ? 'bg-dark text-light border-secondary hover-bg-secondary'
                          : 'hover-bg-light'
                    }
                    style={{
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Show ellipsis if needed */}
              {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                  {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                    <PaginationItem disabled>
                      <PaginationLink
                        className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                      >
                        ...
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageClick(totalPages)}
                      className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              {/* Next page */}
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  next
                  onClick={handleNextPage}
                  className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                  title="Next page"
                >
                  <FaAngleRight />
                </PaginationLink>
              </PaginationItem>

              {/* Last page */}
              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink
                  last
                  onClick={handleLastPage}
                  className={isDarkMode ? 'bg-dark text-light border-secondary' : ''}
                  title="Last page"
                >
                  <FaAngleDoubleRight />
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </Col>
      </Row>
    );
  }
);

PaginationComponent.displayName = 'PaginationComponent';

export default PaginationComponent;
