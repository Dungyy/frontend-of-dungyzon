import React, { useState } from "react";
import Axios from "axios";
import { SpinnerDiamond } from "spinners-react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
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
} from "reactstrap";

import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(
        `https://dungyzonapi.onrender.com/search/${data}`
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
    fetchData();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div style={{ fontSize: "25px" }}>
        <Navbar
          color=""
          light={!isDarkMode}
          dark={isDarkMode}
          expand="md"
          className="mb-5"
          size="xl"
        >
          <NavbarBrand style={{ fontSize: "25px" }} href="/">
            DINGYZON
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
            <h1 className="display-2">DINGYZON</h1>
          </Col>
        </Row>
        <br />
        <br />
        <Row className="justify-content-center">
          <Col md="7">
            <Form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center">
                <FormGroup className="mb-0 flex-grow-1">
                  <Label for="searchInput">
                    Dingyzon the fastest amazon product search engine AI ever
                    created made by yours truly dungy😜
                  </Label>
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
                <Button
                  // style={{ width: "100%", height: "100%" }}
                  style={{marginTop:"40px"}}
                  color="primary"
                >
                  Search
                </Button>
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
                            {"⭐️".repeat(Math.floor(result.stars))}
                          </p>
                        </>
                      )}
                      <p className="card-reviews">
                        Total Reviews: {result.total_reviews}
                        <br />
                        Best Seller:{" "}
                        {result.is_best_seller ? (
                          <FaThumbsUp />
                        ) : (
                          <FaThumbsDown />
                        )}
                        <br />
                        Amazon Choice:{" "}
                        {result.is_amazon_choice ? (
                          <FaThumbsUp />
                        ) : (
                          <FaThumbsDown />
                        )}
                        <br />
                        Limited Deal:{" "}
                        {result.is_limited_deal ? (
                          <FaThumbsUp />
                        ) : (
                          <FaThumbsDown />
                        )}
                      </p>
                      <Button
                        style={{ marginLeft: "10px" }}
                        color="link"
                        onClick={() => {
                          window.open(result.url, "_blank");
                        }}
                      >
                        View on Amazon
                      </Button>
                      {result.has_prime && (
                        <p style={{ color: "gold" }} className="card-prime">
                          Prime available!
                        </p>
                      )}
                    </CardBody>
                  </Card>
                </div>
              ))}
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
