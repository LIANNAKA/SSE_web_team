import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIslogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (!signupEmail || !signupPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
      email: signupEmail,
      password: signupPassword,
      type: "signup",
      time: new Date().toLocaleString()
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setMessage("Registration successful. Please log in");
    setIslogin(true);
  };

  const handleLogin = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (user) {
      setMessage(`Welcome back, ${loginEmail}!`);
      const loginEntry = {
        email: loginEmail,
        type: "login",
        time: new Date().toLocaleString()
      };
      storedUsers.push(loginEntry);
      localStorage.setItem("users", JSON.stringify(storedUsers));
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <div className="text-end">
        <button className="btn btn-outline-primary me-2" onClick={() => navigate("/admin")}>Admin Button</button>
        <Link className="btn btn-link" to="/admin"></Link>
      </div>

      <div className="card mx-auto mt-4" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Shri Shyam Enterprises</h3>

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
              <h5 className="text-center mb-3">Login Form</h5>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group">
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
              <div className="mb-3 text-end">
                <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
              </div>
              <button className="btn btn-success w-100" onClick={handleLogin}>
                Login
              </button>
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setIslogin(false); }}>
                  Sign Up Now
                </a>
              </p>
            </>
          ) : (
            <>
              <h5 className="text-center mb-3">Sign Up Form</h5>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
              <div className="mb-3 input-group">
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
  );
}

export default AuthForm;
