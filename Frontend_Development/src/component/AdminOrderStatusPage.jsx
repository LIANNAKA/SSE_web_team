// OrderStatusPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrderStatusPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all orders on page load
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📦 Order Status</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Address</th>
              <th>Description</th>
              <th>Status</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userName}</td>
                <td>{order.address}</td>
                <td>{order.description}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrderStatusPage;
