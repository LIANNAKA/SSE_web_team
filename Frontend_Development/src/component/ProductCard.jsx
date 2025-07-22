import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  
  if (!product) return null;
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleBuy = () => {
    navigate("/checkout", {
      state: {
        product,
        quantity,
      },
    });
  };

  return (
    // Use Bootstrap 'col' classes if used inside a row for even better responsiveness!
    <div className="container px-1">
      <div className="card h-100 text-center shadow-sm rounded-4" style={{border: "none"}}>
        <img
          src={product.image}
          className="card-img-top img-fluid"
          alt={product.name}
          style={{
            height: "150px",
            objectFit: "cover",
            width: "100%",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem"
          }}
        />
        <div className="card-body p-3 p-sm-4">
          <h6 className="card-title text-start mb-2" style={{fontSize: "1.1rem"}}>{product.name}</h6>
          <p
            className="card-text text-start mb-3"
            style={{
              // Adaptive font size for small screens
              fontSize: "0.9rem",
              minHeight: "2.2em"
            }}
          >
            {product.description.split(" ").slice(0, 17).join(" ")}
          </p>

          <div className="d-flex justify-content-center align-items-center mb-3 flex-wrap">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleDecrease}
              style={{minWidth: '32px'}}
            >
              -
            </button>
            <span className="mx-2 fw-bold" style={{fontSize: "1rem"}}>{quantity}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleIncrease}
              style={{minWidth: '32px'}}
            >
              +
            </button>
          </div>
          <button
            className="btn btn-success w-100"
            style={{
              fontSize: "1rem",
              padding: "8px 0"
            }}
            onClick={handleBuy}
          >
            Buy
          </button>
        </div>
      </div>

      {/* Extra improvements for small screens */}
      <style>{`
        @media (max-width: 575.98px) {
          .card-body {
            padding: 1rem !important;
          }
          .card-title {
            font-size: 1rem !important;
          }
          .card-text {
            font-size: .9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;