import React, { useState } from "react";
import Axios from "axios";
import { SpinnerDiamond } from "spinners-react";
import { Container, Row, Col } from "reactstrap";

import NavbarComponent from "./Components/Navbar";
import SearchForm from "./Components/SearchForm";
import PaginationComponent from "./Components/Pagination";
import ProductCard from "./Components/Card";

import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);


  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/search/${data}?page=${currentPage}`
      );
      setSearchResults(res.data.results);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData();
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <NavbarComponent
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <br />
      <br />
      <br />
      <br />
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col className="text-center">
            <h1 className="display-2">DUNGYZON</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="7">
            <SearchForm handleSubmit={handleSubmit} setData={setData} />
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
          ) : error ? (
            <Col className="text-center my-5">
              <p>Error: {error}</p>
            </Col>
          ) : searchResults.length > 0 ? (
            <div className="cards-container">
              {searchResults.map((result) => (
                <ProductCard
                  key={result.position}
                  result={result}
                  isDarkMode={isDarkMode}
                />
              ))}
              <PaginationComponent
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <Col className="text-center my-5">
              <h2>Search for your favorite Amazon product! :)</h2>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
