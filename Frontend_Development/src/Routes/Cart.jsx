import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  // Update Quantity
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;

    fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQty }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  // Remove Item
  const removeFromCart = (id) => {
    fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== id)
        );
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  // Calculate Total
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="row">
          {/* Cart Items */}
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3 shadow-sm">
                <div className="row g-0 align-items-center">
                  <div className="col-md-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded-start"
                      style={{ maxHeight: "120px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text mb-1">Price: ₹{item.price}</p>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center mb-2 gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="card-text mb-0">
                        <small className="text-muted">
                          Subtotal: ₹{item.price * item.quantity}
                        </small>
                      </p>

                      {/* Remove Button */}
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="col-md-4">
            <div className="card bg-light shadow-sm">
              <div className="card-body">
                <h4 className="card-title">Total Bill</h4>
                <hr />
                <p className="fs-5">₹ {calculateTotal()}</p>
                <button className="btn btn-success w-100 mt-3">Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;