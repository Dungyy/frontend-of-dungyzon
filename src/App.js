import React, { useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [data, setData] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await Axios.get(`http://localhost:5000/search/${data}`);
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

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div className={isNightMode ? "App night-mode" : "App"}>
      <h1>Amazon Product Search</h1>
      <div className="toggle-container">
        <label className="toggle-label">Night Mode</label>
        <label className="switch">
          <input type="checkbox" onChange={toggleNightMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          placeholder="Search.."
          onChange={(event) => {
            setData(event.target.value);
          }}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((result) => (
            <div className="card" key={result.position}>
              <div className="card-image">
                <img src={result.image} alt={result.image} />
              </div>
              <div className="card-content">
                <h2 className="card-title">{result.name}</h2>
                <p className="card-price">Price: {result.price_string}</p>
                <p className="card-stars">Stars: {result.stars}</p>
                <p className="card-reviews">
                  Total Reviews: {result.total_reviews}
                </p>
                {result.has_prime && (
                  <p className="card-prime">Prime available!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2>Search for yor favorite Amazon product with DINGYZON</h2>
      )}
    </div>
  );
}

export default App;
