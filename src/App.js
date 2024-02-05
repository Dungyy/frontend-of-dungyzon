// App.js
import React, { useState } from 'react';
import { SpinnerDiamond } from 'spinners-react';
import { Container, Row, Col } from 'reactstrap';
import NavbarComponent from './Components/Navbar';
import SearchForm from './Components/SearchForm';
import PaginationComponent from './Components/Pagination';
import ProductCard from './Components/Card';
import Footer from './Components/Footer';
import './App.css';
import { useSearchData } from './hooks/fetch';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { searchResults, isLoading, currentPage, setCurrentPage, error, setQuery } = useSearchData(
    '',
    1
  );

  const handleSubmit = (searchTerm) => {
    setQuery(searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <NavbarComponent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Container fluid>
        <Row className="d-flex flex-column align-items-center">
          <Col md="5" className="text-center">
            <br />
            <br />
            <br />
            <br />
            <br />
            <h3 className="my-2">Search for your favorite Amazon product! :)</h3>
            <SearchForm
              handleSubmit={handleSubmit}
              isDarkMode={isDarkMode}
              className="search-form"
            />
          </Col>
        </Row>
        <Row>
          <Col className="text-center my-5">
            {isLoading ? (
              <SpinnerDiamond
                size={200}
                thickness={199}
                speed={100}
                color="#4b69f0"
                secondaryColor="grey"
              />
            ) : error ? (
              <p>Please try at a later time</p>
            ) : searchResults.length > 0 ? (
              <div className="cards-container">
                {searchResults.map((result) => (
                  <ProductCard key={result.position} result={result} isDarkMode={isDarkMode} />
                ))}
                <PaginationComponent
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
