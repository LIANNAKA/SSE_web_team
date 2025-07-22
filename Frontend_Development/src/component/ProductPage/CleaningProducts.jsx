import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const CleaningProducts = () => {
  const [cleaningProducts, setCleaningProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products?category=cleaning")
      .then((res) => res.json())
      .then((data) => setCleaningProducts(data))
      .catch((err) => console.error("Error fetching cleaning products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>All Cleaning Products</h1>
      <div className="row">
        {cleaningProducts.length === 0 ? (
          <div>No products found.</div>
        ) : (
          cleaningProducts.map((product) => (
            <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CleaningProducts;