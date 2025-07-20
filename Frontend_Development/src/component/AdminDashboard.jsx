import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // New field
  const [message, setMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  // Create new user
  const handleCreateUser = () => {
    if (!email || !password) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }
    if (users.some((u) => u.email === email)) {
      setMessage("⚠️ User already exists.");
      return;
    }
    setUsers([...users, { email }]); // Password is not stored
    setMessage(`✅ User ${email} created successfully.`);
    setEmail("");
    setPassword("");
  };

  // Delete user by email
  const handleDeleteUser = (targetEmail) => {
    const filtered = users.filter((user) => user.email !== targetEmail);
    setUsers(filtered);
    setMessage(`🗑️ User ${targetEmail} deleted.`);
  };

  // Forgot password simulation
  const handleForgotPassword = () => {
    if (!resetEmail) {
      setMessage("⚠️ Please enter an email.");
      return;
    }
    if (users.some((u) => u.email === resetEmail)) {
      setMessage(`📩 Password reset link sent to ${resetEmail}`);
      setResetEmail("");
    } else {
      setMessage("❌ User not found.");
    }
  };

  // Admin triggers a secure reset (no password visibility)
  const handleResetPassword = () => {
    setMessage("🔐 Password reset link has been sent to user's email (simulated).");
  };

  return (
    <div className="container py-5">
      <div className="bg-light p-4 rounded shadow">
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        {/* Dashboard user count */}
        <div className="mb-4">
          <h5>Total Registered Users: <span className="badge bg-secondary">{users.length}</span></h5>
        </div>

        {/* Create User */}
        <div className="mb-4">
          <h4>Create User</h4>
          <div className="input-group mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              placeholder="Set user password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleCreateUser}>
              Create
            </button>
          </div>
        </div>

        {/* List Users */}
        <div className="mb-4">
          <h4>All Users</h4>
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="list-group">
              {users.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {user.email}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user.email)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Admin Forgot Password */}
        <div className="mb-4">
          <h4>Admin Forgot Password</h4>
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your admin email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button className="btn btn-warning" onClick={handleForgotPassword}>
              Send Reset Link
            </button>
          </div>
        </div>

        {/* Admin-Triggered Password Reset */}
        <div className="mb-4">
          <h4>Reset Password (Send Link to User)</h4>
          <button className="btn btn-success" onClick={handleResetPassword}>
            Send Reset Email
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="alert alert-info mt-3" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
