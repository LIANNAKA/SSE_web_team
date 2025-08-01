import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserDashboard from "./UserDashboard.jsx";

const UserProfileDropDown = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="transparent"
        className="nav-link text-white border-0 fw-semibold"
        id="profile-dropdown"
        >
        {userName}
        </Dropdown.Toggle>


      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate("/userdashboard")}>
          {" "}
          View Dashboard
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate("/profile")}>
          {" "}
          My Profile
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate("/orders")}>
          {" "}
          My Orders
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate("/wishlist")}>
          {" "}
          Wishlist
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate("/address")}>
          {" "}
          Manage Addresses
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout} className="text-danger">
          🚪 Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserProfileDropDown;