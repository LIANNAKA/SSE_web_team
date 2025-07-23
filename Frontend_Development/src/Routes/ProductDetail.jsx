import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const ProductDetail = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      axiosInstance
        .get(`/products/${productId}`)
        .then((res) => {
          console.log("Fetched product:", res.data);
          setProduct(res.data);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setError("Product not found or an error occurred.");
        });
    }
  }, [productId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Loading product...</p>;

  return (
    <div className="container mt-4">
      <h2>{product.name}</h2>
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{ maxWidth: "300px" }}
      />
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Category: {product.category}</p>
      <p>In Stock: {product.stock}</p>
    </div>
  );
};

export default ProductDetail;
