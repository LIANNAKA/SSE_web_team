import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ setActiveSection }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/"); // Redirect to Home page
  };

  return (
    <div className="bg-light border-end h-100 p-3">
      <h5 className="mb-4 text-uppercase">Admin Panel</h5>

      <button onClick={() => setActiveSection("userlist")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">User List</button>
      <button onClick={() => setActiveSection("deleteuser")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Delete User</button>
      <button onClick={() => setActiveSection("productlist")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Product List</button>
      <button onClick={() => setActiveSection("forgotreset")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Forgot Password</button>
      <button onClick={() => setActiveSection("resetpassword")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Reset Password</button>
      <button onClick={() => setActiveSection("productupload")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Upload Products</button>
      <button onClick={() => setActiveSection("deleteproduct")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Delete Products</button>
      <button onClick={() => setActiveSection("productstock")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Stocks</button>
      <button onClick={() => setActiveSection("bannerupload")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Upload Banner</button>
      <button onClick={() => setActiveSection("orderstatus")} className="btn btn-link d-block text-start text-decoration-none text-uppercase">Order Status</button>

      <button
        onClick={handleLogout}
        className="btn btn-link d-block text-start text-decoration-none text-uppercase text-danger"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
