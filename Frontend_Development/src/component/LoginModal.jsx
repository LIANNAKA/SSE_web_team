import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModel";
import axiosInstance from "../axiosInstance";
import Modal from 'bootstrap/js/dist/modal';


function LoginModal({ setShowLoginModal }) {
  const navigate = useNavigate();
  const [isLogin, setIslogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
 
  const handleSignUp = async () => {
  if (!signupName || !signupMobile || !signupEmail || !signupPassword || !confirmPassword) {
    setMessage("Please fill in all fields.");
    return;
  }
  if (signupPassword !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }
  
  console.log('Sign Up Payload:', { name: signupName, mobile: signupMobile, email: signupEmail, password: signupPassword });

  try {
    const { data } = await axiosInstance.post("/register", {
      name: signupName,
      mobile: signupMobile,
      email: signupEmail,
      password: signupPassword,
    });

    setMessage(data.message || "Registration successful. Please log in.");
    setIslogin(true);
    setSignupName("");
    setSignupMobile("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
  } catch (error) {
    // setMessage(error.response?.data?.message || "Registration failed.");
    setMessage(error.response?.data?.error || "Registration failed.");

  }
};



const handleLogin = async () => {
  if (!loginEmail || !loginPassword) {
    setMessage("Please enter email and password.");
    return;
  }

  try {
    const { data } = await axiosInstance.post("/login", {
      email: loginEmail,
      password: loginPassword,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.userName || loginEmail);
    window.dispatchEvent(new Event("storage"));  // Update Navbar

    setMessage(data.message || `Welcome back, ${data.userName || loginEmail}!`);

    setTimeout(() => {
      setShowLoginModal(false);  // Close Modal (React way)
      navigate('/');             // Navigate to Home
    }, 1500);
  } catch (error) {
    setMessage(error.response?.data?.message || "Invalid credentials.");
  }
};

  return (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Shri Shyam Enterprises</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowLoginModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <div className="btn-group d-flex mb-4" role="group">
            <button
              className={`btn ${isLogin ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setIslogin(true)}
            >
              Login
            </button>
            <button
              className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setIslogin(false)}
            >
              Sign Up
            </button>
          </div>

            {isLogin ? (
              <>
                {/* Login Form */}
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="form-control"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                <div className="text-end mb-3">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#forgotPasswordModal"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button className="btn btn-success w-100" onClick={handleLogin}>
                  Login
                </button>
              </>
            ) : (
              <>
                {/* Sign Up Form */}
                <input
                  type="text"
                  placeholder="Name"
                  className="form-control mb-3"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="form-control mb-3"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <div className="input-group mb-3">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                <button className="btn btn-primary w-100" onClick={handleSignUp}>
                  Sign Up
                </button>
              </>
            )}

            {message && (
              <div className="alert alert-info mt-3 text-center" role="alert">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;