import React from "react";
import { Link } from "react-router-dom";

const AdminButton = () => {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "admin") {
    return null; // 👈 Don't show the button if not admin
  }

  return (
    <Link to="/admin" className="btn btn-warning mx-2">
      Admin Dashboard
    </Link>
  );
};

export default AdminButton;
