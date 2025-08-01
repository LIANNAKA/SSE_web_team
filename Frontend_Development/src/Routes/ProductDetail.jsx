import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      axiosInstance
        .get(`/products/${productId}`)
        .then((res) => {
          setProduct(res.data);
          setError("");
          setQuantity(1); // reset quantity on new product load
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          setError("Product not found or an error occurred.");
        });
    }
  }, [productId]);

  const navigate = useNavigate();
const handleBuy = async () => {
  if (!product) return;

  try {
    await axiosInstance.post("/cart", {
      productId: product.productId,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
    });

    navigate("/cart"); // ✅ Redirect to cart after adding
  } catch (err) {
    console.error("Error adding to cart:", err);
    setError("Failed to add to cart. Please try again.");
  }
};

  const incrementQuantity = () => {
    if (product) setQuantity((prev) => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  if (error)
    return (
      <div className="container py-5">
        <p className="text-danger">{error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="container py-5">
        <p>Loading product...</p>
      </div>
    );
console.log("Full image path:", `http://localhost:5000${product.imageUrl}`);
console.log("Raw product.imageUrl:", product.imageUrl);

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-start">
        {/* Image on left */}
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-start">
          <div
            className="p-3 bg-white rounded shadow-sm"
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <img src={`http://localhost:5000${product.imageUrl}`} 

              alt={product.name}
              className="img-fluid rounded"
              style={{
                maxHeight: "200px",
                objectFit: "contain",
                background: "#f8f9fa",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Description on right */}
        <div className="col-12 col-md-6 d-flex">
          <div className="bg-light p-4 rounded shadow flex-grow-1 d-flex flex-column">
            <h2 className="mb-3">{product.name}</h2>
            <p style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
              {product.description}
            </p>
            <p>
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p>
              <strong>In Stock:</strong> {product.stock}
            </p>

            <div className="d-flex align-items-center mb-3 mt-auto">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="form-control text-center mx-2"
                style={{ maxWidth: "60px" }}
                aria-label="Selected quantity"
              />
              <button
                className="btn btn-secondary"
                type="button"
                onClick={incrementQuantity}
                disabled={product && quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary w-100 w-sm-50 w-md-25"
               style={{ fontSize: "14px", padding: "8px 16px" }}
              onClick={handleBuy}
              disabled={product.stock === 0}
            >
              Buy
            </button>

            {message && (
              <div className="mt-3 text-success fw-bold" aria-live="polite">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
