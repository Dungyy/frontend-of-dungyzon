import React from "react";
import {
  Col,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const PaginationComponent = ({ currentPage, handlePageChange, isDarkMode }) => (
  <Row>
    <Col className="text-center my-5 d-flex">
      <Pagination size="lg" className={isDarkMode ? "dark-mode" : ""}>
        {[...Array(15)].map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem
              key={page}
              active={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              <PaginationLink>{page}</PaginationLink>
            </PaginationItem>
          );
        })}
      </Pagination>
    </Col>
  </Row>
);

export default PaginationComponent;
