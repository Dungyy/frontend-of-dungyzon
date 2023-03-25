import React, { useState } from "react";
import Axios from "axios";
import { SpinnerDiamond } from "spinners-react";
import { FaThumbsUp } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      const res = await Axios.get(
        `https://dungyzonapi.onrender.com/search/${data}?page=${page}`
      );
      setSearchResults(res.data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData(currentPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
     <div style={{ fontSize: "21px", paddingTop: "46px"}}>
  <Navbar
    color=""
    light={!isDarkMode}
    dark={isDarkMode}
    expand="md"
    className="mb-5"
    size="xl"
    fixed="top"
  >
    <NavbarBrand style={{ fontSize: "21px" }} href="/">
      DUNGYZON
    </NavbarBrand>
    <Nav className="ml-auto togglebutton" navbar>
      <NavItem>
        <NavLink href="#" onClick={toggleDarkMode}>
          {isDarkMode ? "💡 Light Mode" : "🌛 Dark Mode"}
        </NavLink>
      </NavItem>
    </Nav>
  </Navbar>
  
</div>

      <Container>

        <Row className="justify-content-center align-items-center">
          <Col className="text-center">
            <br /><br/><br />
            
            <h1 className="display-2">DUNGYZON</h1>
          </Col>

        </Row>
        <br />
        <br />
        <Row className="justify-content-center">
          <Col md="7">
            <Form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center">
                <Col md="9" className="p-0">
                  <FormGroup className="mb-0 flex-grow-1">
                    <Label for="searchInput">
                      Dungyzon the fastest amazon product search engine AI ever
                      created made by yours truly dungy😜
                    </Label>
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
                <Col md="3" className="p-">
                  <br />
                  <br />
                  <br />
                  <br />
                  <Button color="primary" type="submit">
                    Search
                  </Button>
                </Col>
              </div>
            </Form>
          </Col>
        </Row>

        <Row>
          {isLoading ? (
            <Col className="text-center my-5">
              <SpinnerDiamond
                size={200}
                thickness={199}
                speed={98}
                color="#4b69f0"
                secondaryColor="grey"
              />
            </Col>
          ) : searchResults.length > 0 ? (
            <div className="cards-container">
              {searchResults.map((result) => (
                <div className="card-column" key={result.position}>
                  <Card className="card">
                    <CardImg
                      top
                      src={result.image}
                      alt={result.image}
                      className="card-img-top"
                    />
                    <CardBody>
                      <CardTitle tag="h2">{result.name}</CardTitle>
                      <br />
                      <CardSubtitle tag="h5" className="mb-2 text-muted">
                        Price:
                        <span style={{ color: "green" }}>
                          {result.price_string}
                        </span>
                      </CardSubtitle>
                      {result.stars && (
                        <>
                          <p className="card-stars">
                            Stars: {result.stars}{" "}
                            {result.stars > 4.5
                              ? "⭐️⭐️⭐️⭐️⭐️"
                              : "⭐️".repeat(Math.floor(result.stars))}
                          </p>
                        </>
                      )}

                      {result.has_prime && (
                        <p style={{ color: "gold" }} className="card-prime">
                          Prime available!
                        </p>
                      )}
                      <p className="card-reviews">
                        Total Reviews: {result.total_reviews}
                        <br />
                        {result.is_best_seller && (
                          <>
                            Best Seller: <FaThumbsUp />
                            <br />
                          </>
                        )}
                        {result.is_amazon_choice && (
                          <>
                            Amazon Choice: <FaThumbsUp />
                            <br />
                          </>
                        )}
                        {result.is_limited_deal && (
                          <>
                            Limited Deal: <FaThumbsUp />
                            <br />
                          </>
                        )}
                      </p>

                      <Button
                        className={isDarkMode ? "dark-mode" : ""}
                        color=""
                        onClick={() => {
                          window.open(result.url, "_blank");
                        }}
                      >
                        View on Amazon
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              ))}
              <Row>
                <Col className="text-center my-5 d-flex">
                  <Pagination
                    size="lg"
                    className={isDarkMode ? "dark-mode" : ""}
                  >
                    {/* <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        first
                        onClick={() => handlePageChange(1)}
                      />
                    </PaginationItem> */}
                    {/* <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem> */}
                    {/* Add dynamic PaginationItems based on the number of pages */}
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
                    {/* <PaginationItem>
                      <PaginationLink
                        next
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem> */}
                    {/* <PaginationItem>
                      <PaginationLink
                        last
                        onClick={() => handlePageChange(5)}
                      />
                    </PaginationItem> */}
                  </Pagination>
                </Col>
              </Row>
            </div>
          ) : (
            <Col className="text-center my-5">
              {/* lol */}
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />

              <h2>A quick and easy search for any product :)</h2>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
