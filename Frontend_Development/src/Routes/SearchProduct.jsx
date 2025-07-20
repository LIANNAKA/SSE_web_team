import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      axios
        .get(`http://localhost:5500/api/products/search?q=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search Results for "{query}"</h2>
      <div className="row">
        {results.length > 0 ? (
          results.map((product, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;