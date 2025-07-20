import React, { useState, useEffect } from "react";
import axios from "axios";

const UserOrderPlace = ({ cartItems, totalPrice }) => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [userName, setUserName] = useState(""); // could be from login context

  // Optional: fetch user data if logged in
  useEffect(() => {
    // Simulate logged-in user
    setUserName("Deepak Sharma");
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/orders", {
        userName,
        address,
        description: cartItems.map(item => `${item.name} x${item.quantity}`).join(", "),
        paymentMethod,
      });
      alert("Order Placed Successfully!");
    } catch (err) {
      console.error(err);
      alert("Order Failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <form onSubmit={handleOrder}>
        <div className="mb-3">
          <label>User Name</label>
          <input className="form-control" value={userName} disabled />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Payment Method</label><br />
          <select
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online (Coming Soon)</option>
          </select>
        </div>

        <div className="mb-3">
          <h4>Order Summary:</h4>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>{item.name} × {item.quantity}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> ₹{totalPrice}</p>
        </div>

        <button type="submit" className="btn btn-success">Place Order</button>
      </form>
    </div>
  );
};

export default UserOrderPlace;
