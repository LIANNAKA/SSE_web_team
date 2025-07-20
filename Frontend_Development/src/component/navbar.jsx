import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import UserProfileDropDown from "../component/UserProfileDropDownMenu"; 

const Navbar = ({ setShowLoginModal }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      const updatedName = localStorage.getItem("userName");

      setIsLoggedIn(!!updatedToken);
      setUserName(updatedName || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand d-flex flex-column" to="/">
        <span className="fw-bold fs-4">Shree Shyam</span>
        <span className="fs-6">Enterprises</span>
      </Link>

      <button className="navbar-toggler ms-sm-auto" type="button" onClick={toggleNavbar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <form
        className="d-flex-grow-1 ms-lg-auto py-1 w-100 md-order-1"
        role="search"
        onSubmit={handleSearch}
      >
        <input
          className="form-control"
          type="search"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search"
        />
      </form>

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 px-4">
          <li className="nav-item">
            <Link className="nav-link px-4" to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-4" to="/about" onClick={() => setIsOpen(false)}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link px-4" to="/cart" onClick={() => setIsOpen(false)}>
              Cart
            </Link>
          </li>
          <li className="nav-item">
           {isLoggedIn ? (
            <UserProfileDropDown userName={userName} onLogout={handleLogout} />
            ) : (
            <button
                className="btn nav-link px-4 bg-transparent border-0"
                onClick={() => setShowLoginModal(true)}
            >
                Login
            </button>
            )}

          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
