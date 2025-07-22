import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const StationaryProducts = () => {
  const [stationaryProducts, setStationaryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?category=stationary")
      .then((res) => res.json())
      .then((data) => setStationaryProducts(data))
      .catch((err) => console.error("Error fetching stationary products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>All Stationary Products</h1>
      <div className="row">
        {stationaryProducts.length === 0 ? (
          <div>No products found.</div>
        ) : (
          stationaryProducts.map((product) => (
            <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StationaryProducts;