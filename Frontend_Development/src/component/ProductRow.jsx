import ProductCard from "../component/ProductCard";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ProductRow = () => {
  const [stationaryProducts, setStationaryProducts] = useState([]);
  const [cleaningProducts, setCleaningProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both categories in parallel
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [stationaryRes, cleaningRes] = await Promise.all([
          fetch("http://localhost:5000/api/products?category=stationary"),
          fetch("http://localhost:5000/api/products?category=cleaning"),
        ]);
        const [stationaryData, cleaningData] = await Promise.all([
          stationaryRes.json(),
          cleaningRes.json(),
        ]);
        setStationaryProducts(stationaryData);
        setCleaningProducts(cleaningData);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div>
      {/* Stationary Products */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="mb-4">Stationary Products</h1>
          <Link to="/stationary-products" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="row">
          {stationaryProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      {/* Cleaning Products */}
      <div className="container mt-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Cleaning Products</h1>
          <Link to="/cleaning-products" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="row">
          {cleaningProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="col-6 col-sm-6 col-md-4 col-lg-3 d-flex">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRow;