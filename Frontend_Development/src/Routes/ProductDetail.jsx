import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleBuyClick = async () => {
  try {
    await axiosInstance.post('/cart', {
      productId: product.productId,
      quantity: 1,
    });
    navigate('/cart');
  } catch (err) {
    alert('Failed to add product to cart',err);
  }
};


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
       <button
        onClick={handleBuyClick}
        className="btn btn-primary mt-3"
        disabled={product.stock <= 0} // Optionally disable if out of stock
      >
        Buy
      </button>
    </div>
  );
};

export default ProductDetail;
