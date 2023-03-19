import React, { useState } from "react";
// import "./App.css";
import Axios from "axios";
import { SpinnerDiamond } from "spinners-react";
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
    <Container className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <Row className="justify-content-center align-items-center">
        <Col className="text-center">
          <h1 className="display-2">DINGYZON</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="searchInput"></Label>
              <Input
                style={{ width: "500px" }}
                type="text"
                name="searchInput"
                id="searchInput"
                placeholder="Search.."
                onChange={(event) => {
                  setData(event.target.value);
                }}
              />
            </FormGroup>
            <Button color="primary" type="submit">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="12">
          <Button color="secondary" className="my-3" onClick={toggleDarkMode}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
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
          searchResults.map((result) => (
            <Col
              xs="12"
              sm="6"
              md="4"
              lg="3"
              className="my-3"
              key={result.position}
            >
              <Card>
                <CardImg top src={result.image} alt={result.image} />
                <CardBody>
                  <CardTitle tag="h2">{result.name}</CardTitle>
                  <CardSubtitle tag="h5" className="mb-2 text-muted">
                    Price:{" "}
                    <span style={{ color: "green" }}>
                      {result.price_string}
                    </span>
                  </CardSubtitle>
                  <p className="card-stars">Stars:{result.stars}</p>
                  <p className="card-reviews">
                    Total Reviews: {result.total_reviews}
                  </p>
                  {result.has_prime && (
                    <p style={{ color: "gold" }} className="card-prime">
                      Prime available!
                    </p>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center my-5">
            <h2>A quick and easy search for any product :)</h2>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default App;
