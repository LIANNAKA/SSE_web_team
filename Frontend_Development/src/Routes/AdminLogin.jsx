import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useAuth } from "../context/useAuth";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();

const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter email and password");
    setLoginSuccess(false);
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email,
      password
    });

    if (response.data.success) {
      loginAsAdmin(); 
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminName", response.data.admin.name);
      setLoginSuccess(true);
      setError("");
    } else {
      setLoginSuccess(false);
      setError(response.data.message || "Invalid credentials");
    }

  } catch (err) {
    setLoginSuccess(false);
    setError(err.response?.data?.message || "❌ Login failed. Please try again.");
  }
};



  const goToDashboard = () => {
    navigate("/admin");
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center m-md-4">
      <h2 className="mb-4 text-primary">Shri Syam Enterprises</h2>

      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h4 className="mb-3 text-center">Admin Login</h4>

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}

        {loginSuccess && (
          <div className="mt-3">
            <button className="btn btn-success w-100" onClick={goToDashboard}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;
