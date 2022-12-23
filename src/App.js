import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [data, setData] = useState("");

  const fetchData = () => {
    Axios.get(`https://dungy-amazon-scraper.herokuapp.com/search/${data}`).then(
      (res) => {
        console.log(res.data);
      }
    );
  };

  return (
    <div className="App">
      <h1>YO</h1>
      <input
        placeholder="text"
        onChange={(event) => {
          setData(event.target.value);
        }}
      />
      <button onClick={fetchData}>Send </button>
    </div>
  );
}

export default App;
