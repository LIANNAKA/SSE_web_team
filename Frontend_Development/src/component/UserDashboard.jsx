import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserSidebar from "./UserProfileDashboard/UserSidebar";
import MyOrder from "./UserProfileDashboard/MyOrder";
import MyAddress from "./UserProfileDashboard/MyAddress";
import MyProfile from "./UserProfileDashboard/MyProfile";
import Wishlist from "./UserProfileDashboard/Wishlist";
import MyOffer from "./UserProfileDashboard/MyOffer";

const UserDashboard = () => {
  const location = useLocation();

  // Normalize to lowercase
  const sectionFromState = location.state?.section?.toLowerCase() || "profile";
  const [activeSection, setActiveSection] = useState(sectionFromState);

  useEffect(() => {
    // Update section if navigation state changes after mount
    if (location.state?.section) {
      setActiveSection(location.state.section.toLowerCase());
    }
  }, [location.state?.section]);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <MyProfile />;
      case "address":
        return <MyAddress />;
      case "order":
        return <MyOrder />;
      case "offers":
        return <MyOffer />;
      case "wishlist":
        return <Wishlist />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div style={{ width: "250px" }} className="bg-light border-end">
        <UserSidebar setActiveSection={setActiveSection} />
      </div>

      <div className="flex-grow-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default UserDashboard;
