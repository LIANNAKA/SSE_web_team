import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";

const AllProduct = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
      console.log('Fetched product count:', res.data.length);
      setProducts(res.data);
    })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Products</h2>
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
