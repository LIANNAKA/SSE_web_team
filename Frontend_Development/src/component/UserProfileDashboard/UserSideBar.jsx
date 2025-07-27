import React from "react";

const UserSidebar = ({ setActiveSection, handleLogout }) => {
  return (
    <div className="bg-light border-end h-100 p-3">
      <h5 className="mb-4 text-uppercase">User Panel</h5>

      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark" onClick={() => setActiveSection("profile")}>
        Profile
      </button>
      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark" onClick={() => setActiveSection("address")}>
        Address
      </button>
      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark" onClick={() => setActiveSection("order")}>
        Orders
      </button>
      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark" onClick={() => setActiveSection("offers")}>
        My Offers
      </button>
      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark" onClick={() => setActiveSection("wishlist")}>
        Wishlist
      </button>

      {/* ✅ Fixed logout handler */}
      <button className="btn btn-link d-block text-start text-decoration-none text-uppercase text-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserSidebar;
