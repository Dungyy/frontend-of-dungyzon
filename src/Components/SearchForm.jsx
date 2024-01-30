import React from 'react';
import { Col, Form, FormGroup, Input, Button } from 'reactstrap';

const SearchForm = ({ handleSubmit, setData }) => (
  <Form onSubmit={handleSubmit}>
    <div className="d-flex align-items-center">
      <Col md="9" className="p-0">
        <FormGroup className="mb-0 flex-grow-1">
          <br />
          <br />
          <br />
          <Input
            type="text"
            name="searchInput"
            id="searchInput"
            placeholder="Search..."
            onChange={(event) => {
              setData(event.target.value);
            }}
          />
        </FormGroup>
      </Col>
      <Col md="1" className="p-1 mt-2">
        <br />
        <br />
        <Button type="submit" className="btn-lg btn-outline-primary custom-wide-btn">
          Search
        </Button>
      </Col>
    </div>
  </Form>
);

export default SearchForm;
