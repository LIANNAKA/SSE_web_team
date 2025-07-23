import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query || !query.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");

    axiosInstance
      .get(`/api/products/search?q=${query}`)
      .then((res) => {
        console.log("Search API result:", res.data);
        setResults(res.data);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setError("Error fetching results. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search Results{query ? ` for "${query}"` : ""}</h2>

      {loading && <div className="my-3">Loading...</div>}

      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && !query && (
        <p className="mt-3">Please enter a search query.</p>
      )}

      {!loading && !error && query && results.length === 0 && (
        <p className="mt-3">No products found.</p>
      )}

      <div className="row">
        {results.map((product) => {
          if (!product.productId) {
            console.warn("Missing productId in product:", product);
            return null;
          }

          return (
            <div key={product.productId} className="col-md-4 mb-4">
              <div className="card h-100">
                <img
                  src={product.imageUrl || product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="mt-auto">
                    <Link to={`/product/${product.productId}`}>View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
