import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

  const stationaryCategories = [
  "Adhesives",
  "Calculator",
  "Envelope",
  "Eraser",
  "File/Folder",
  "Highlighter",
  "Marker",
  "Miscellaneous",
  "Paper",
  "Pen",
  "Pencil",
  "Register",
  "Tools",
  "Stationary"
];

const StationaryProduct = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        const filtered = res.data.filter((p) =>
          stationaryCategories.some(cat => cat.toLowerCase() === (p.category || "").toLowerCase())
        );
        setProducts(filtered);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Stationary Products</h2>
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default StationaryProduct;
