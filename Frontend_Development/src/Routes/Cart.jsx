import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setLoading(false);
      });
  }, []);

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;

    fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  const removeFromCart = (productId) => {
    fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "DELETE",
    })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">CART</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-12 col-md-8">
            {cartItems.map((item) => (
              <div key={item.productId} className="card mb-4 shadow-sm p-3">
                <div className="row g-3 align-items-center">

                  {/* Product Image */}
                  <div className="col-12 col-sm-3 text-center">
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{
                        maxWidth: "100px",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/default-product.png";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="col-12 col-sm-5 text-center text-sm-start">
                    <h5 className="mb-2">{item.name}</h5>
                    <p className="mb-1">
                      <strong>Price:</strong> ₹{item.price}
                    </p>
                    <p className="text-muted mb-0">
                      <small>Subtotal: ₹{item.price * item.quantity}</small>
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="col-12 col-sm-4 text-center text-sm-end">
                    <div className="d-flex justify-content-center justify-content-sm-end align-items-center gap-2 flex-wrap mb-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="col-12 col-md-4 mt-4 mt-md-0">
            <div className="card bg-light shadow-sm">
              <div className="card-body text-center text-md-start">
                <h4 className="card-title">Total Bill</h4>
                <hr />
                <p className="fs-5">₹ {calculateTotal()}</p>
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;