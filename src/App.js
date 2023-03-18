import React, { useState } from "react";
import "./App.css";
import Axios from "axios";
import { SpinnerDiamond } from "spinners-react";

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ alignItems: "center", fontSize: "large" }}>
          <h1 style={{ fontSize: "60px"}}>DINGYZON Search</h1>
          <br />
          <div className="toggle-container">
            <label className="toggle-label">Night Mode</label>
            <label className="switch">
              <input type="checkbox" onChange={toggleNightMode} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
      <div className="search-card">
        <form onSubmit={handleSubmit}>
          <input
            style={{ maxWidth: "40rem" }}
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
      </div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div style={{ alignItems: "center" }}>
            <SpinnerDiamond
              size={200}
              thickness={199}
              speed={98}
              color="#f0c14b"
              secondaryColor="rgba(57, 172, 78, 1)"
            />
          </div>
        </div>
      ) : searchResults.length > 0 ? (
        
        <div className="search-results">
          
          {searchResults.map((result) => (
            <div className="card" key={result.position}>
              <div className="card-image">
                <img src={result.image} alt={result.image} />
              </div>
              <div className="card-content">
                <h2 className="card-title">{result.name}</h2>
                <p className="card-price">
                  Price:{" "}
                  <span style={{ color: "green" }}>{result.price_string} </span>
                </p>
                <p className="card-stars">
                  Stars:{result.stars}
                </p>
                <p className="card-reviews">
                  Total Reviews: {result.total_reviews}
                </p>
                {result.has_prime && (
                  <p style={{ color: "gold" }} className="card-prime">Prime available!</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20rem",
          }}
        >
          <h1>Search for yor favorite Amazon product with DINGYZON</h1>
        </div>
      )}
    </div>
  );
}

export default App;
