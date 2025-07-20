import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import UserSideBar from "./UserProfileDashboard/UserSideBar";
import MyProfile from "./UserProfileDashboard/MyProfile";
import MyAddress from "./UserProfileDashboard/MyAddress";
import MyOrder from "./UserProfileDashboard/MyOrder";
import Wishlist from "./UserProfileDashboard/Wishlist";
import MyOffer from "./UserProfileDashboard/MyOffer";


const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("Profile");

  // Dynamically load components based on sidebar selection
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <MyProfile />;
      case "Address":
        return <MyAddress />;
      case "Order":
        return <MyOrder />;
      case "Offers":
        return <MyOffer />;
      case "UserSideBar":
        return <UserSideBar />;
      case "Wishlist":
        return <Wishlist />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px" }} className="bg-light border-end">
        <UserSideBar setActiveSection={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default UserDashboard;