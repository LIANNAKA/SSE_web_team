import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import UserProfileDropDown from "../component/UserProfileDropDownMenu";

const Navbar = ({ setShowLoginModal }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name || "";
  });

  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef();
  const debounceRef = useRef();

  // Detect clicks outside the dropdown to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!updatedToken);
      setUserName(user?.name || "");
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

  // Search submit (on Enter/submit)
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fetch suggestions from backend as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 250);
  }, [searchQuery]);

  // On dropdown suggestion click
  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    setSearchQuery(""); // Optional: clear box or set to product.name
    // Navigate to product page (edit path per your routing)
    navigate(`/product/${product.productId}`);
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top">
      <Link className="navbar-brand d-flex flex-column" to="/">
        <span className="fw-bold fs-4">Shree Shyam</span>
        <span className="fs-6">Enterprises</span>
      </Link>
      <button
        className="navbar-toggler ms-sm-auto"
        type="button"
        onClick={toggleNavbar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* --- SEARCH BAR --- */}
      <form
        className="d-flex-grow-1 ms-lg-auto py-1 w-100 md-order-1 position-relative"
        role="search"
        onSubmit={handleSearch}
        autoComplete="off"
        ref={searchRef}
      >
        {/* <span className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted">
          <FaSearch />
        </span> */}

        <input
          className="form-control"
          type="search"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search"
          onFocus={() => {
            if (searchQuery) setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (suggestions.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelectedSuggestionIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedSuggestionIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
              );
            } else if (e.key === "Enter") {
              if (selectedSuggestionIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick(suggestions[selectedSuggestionIndex]);
              }
            }
          }}
        />
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="list-group position-absolute w-100 shadow"
            style={{ zIndex: 2000, top: "100%" }}
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.productId}
                className={`list-group-item list-group-item-action ${
                  index === selectedSuggestionIndex ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
          <div
            className="position-absolute w-100 text-center bg-white border"
            style={{ zIndex: 2000, top: "100%" }}
          >
            <small>No results found</small>
          </div>
        )}
      </form>
      {/* --- END SEARCH BAR --- */}
      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 px-4">
          <li className="nav-item">
            <Link
              className="nav-link px-4"
              to="/"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <NavDropdown title="Products" id="products-dropdown">
              <NavDropdown.Item as={Link} to="/products/all">
                All Products
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products/stationary">
                Stationary
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/products/cleaning">
                Cleaning
              </NavDropdown.Item>
            </NavDropdown>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link px-4"
              to="/cart"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
          </li>
          <li className="nav-item">
            {isLoggedIn ? (
              <UserProfileDropDown
                userName={userName}
                onLogout={handleLogout}
              />
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
