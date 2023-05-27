import React from "react";
import { Col, Form, FormGroup, Input, Button } from "reactstrap";

const SearchForm = ({ handleSubmit, setData }) => (
  <Form onSubmit={handleSubmit}>
    <div className="d-flex align-items-center">
      <Col md="9" className="p-0">
        <FormGroup className="mb-0 flex-grow-1">
          <br />
          <br />
          <br />
          <Input
            style={{ width: "100%", height: "100%" }}
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
      <Col md="3" className="p-1 mt-2">
        <br />
        <br />
        <Button color="primary" type="submit">
          Search
        </Button>
      </Col>
    </div>
  </Form>
);

export default SearchForm;