import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

const cleaningCategories = [
  "Cleaning",
  "Air Fresheners",
  "Mops & Wipers",
  "Pest Control",
  "Disposable Items",
  "Printer", //? if you want, otherwise remove
];

const CleaningProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const filtered = res.data.filter((p) =>
          cleaningCategories.includes((p.category || "").trim())
        );
        setProducts(filtered);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Cleaning Products</h2>
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.ProductId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CleaningProduct;
