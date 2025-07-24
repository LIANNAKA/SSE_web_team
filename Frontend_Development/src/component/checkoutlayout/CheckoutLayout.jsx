// src/component/checkoutlayout/CheckoutLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const CheckoutLayout = () => {
  return (
    <div className="checkout-layout container my-4">
      <Outlet /> {/* This renders the nested route components */}
    </div>
  );
};

export default CheckoutLayout;
