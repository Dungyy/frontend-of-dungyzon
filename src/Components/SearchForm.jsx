import React, { useState } from 'react';
import { Col, Form, FormGroup, Input, Button } from 'reactstrap';

const SearchForm = ({ handleSubmit, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(searchTerm); // Pass the search term to the parent's handleSubmit
  };

  return (
    <Form onSubmit={onSubmit}>
      <div className="d-flex align-items-center">
        <Col md="9" className="p-0">
          <FormGroup className="mb-0 flex-grow-1">
            <br />
            <Input
              type="text"
              name="searchInput"
              id="searchInput"
              placeholder="Search for anything..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md="3" className="p-1 mt-2">
          <Button
            className={`mt-auto ${isDarkMode ? 'dark-mode' : ''}`}
            color={isDarkMode ? 'outline-light' : 'outline-dark'}
            type="submit"
          >
            Search
          </Button>
        </Col>
      </div>
    </Form>
  );
};

export default SearchForm;
