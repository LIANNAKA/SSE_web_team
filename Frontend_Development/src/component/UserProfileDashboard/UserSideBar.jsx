import React from "react";

const UserSidebar = ({ setActiveSection }) => {
  return (
    <div className="bg-light border-end h-100 p-3">
      <h5 className="mb-4 text-uppercase">User Panel</h5>
      <button
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Profile")}
      >
        Profile
      </button>
      <button
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Address")}
      >
        Address
      </button>
      <button
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Order")}
      >
        Orders
      </button>
      <button
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Offers")}
      >
        My offers
      </button>
      <button
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Wishlist")}
      >
        wishlist
      </button>
      
      <button
        className="btn btn-link d-block text-start text-danger text-decoration-none text-uppercase text-dark"
        onClick={() => setActiveSection("Logout")}
      >
        Logout
      </button>
    </div>
  );
};

export default UserSidebar;