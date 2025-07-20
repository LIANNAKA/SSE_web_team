import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminResetPassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request reset, 2: Enter new password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Step 1: Send reset link
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    try {
      const res = await axios.post("http://localhost:5500/api/admin/forgot-password", { email });
      setMessage({ type: "success", text: res.data.message || "Reset link sent to your email." });
      setStep(2);
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    try {
      const res = await axios.post("http://localhost:5500/api/admin/reset-password", {
        email,
        token,
        newPassword,
      });
      setMessage({ type: "success", text: res.data.message || "Password reset successfully." });
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.error || "Invalid token or email." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h3 className="mb-4 text-center">Admin Password Reset</h3>

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      {step === 1 && (
        <Form onSubmit={handleForgot}>
          <Form.Group className="mb-3">
            <Form.Label>Admin Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your admin email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Send Reset Link"}
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3">
            <Form.Label>Reset Token</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the token sent to your email"
              value={token}
              required
              onChange={(e) => setToken(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="success" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Reset Password"}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AdminResetPassword;
