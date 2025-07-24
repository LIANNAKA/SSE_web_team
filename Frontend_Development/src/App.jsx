import Navbar from "./component/navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Routes/Home";
import Cart from "./Routes/Cart";
import Products from "./Routes/Products";
import Login from "./Routes/Login";
import Footer from "./component/Footer";
import AdminLogin from "./Routes/AdminLogin";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoginModal from "./component/LoginModal";
import ForgotPasswordModal from "./component/ForgotPasswordModel";
import AdminDashboard from "./Routes/AdminDashboard";
import UserOrderPlace from "./component/UserOrderPlace";
import { useState } from "react";
import AdminBannerUploader from "./component/AdminBannerUploader";
import AdminProductStock from "./component/AdminProductStock";
import UserDashboard from "./component/UserDashboard";
import MyAddress from "./component/UserProfileDashboard/MyAddress";
import MyOffer from "./component/UserProfileDashboard/MyOffer";
import MyOrder from "./component/UserProfileDashboard/MyOrder";
import MyProfile from "./component/UserProfileDashboard/MyProfile";
import UserSideBar from "./component/UserProfileDashboard/UserSideBar";
import Wishlist from "./component/UserProfileDashboard/Wishlist";
import Checkout from "./component/Checkout";
import CheckoutShipping from "./component/checkoutlayout/Shippingaddress";
import CheckoutBill from "./component/checkoutlayout/TotalBill";
import CheckoutOrder from "./component/checkoutlayout/PlaceOrder";
import CheckoutPage from "./component/Checkout";
import ProductDetail from "./Routes/ProductDetail";
import SearchResults from "./Routes/SearchProduct";
import ProductPage from "./Routes/Products";
import ProductCard from "./component/ProductCard";

function App() {
  const userRole = localStorage.getItem("userRole") || "guest";
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="app-wrapper">
      <Navbar setShowLoginModal={setShowLoginModal} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Products />} />
          <Route path="/about" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminorderstatus" element={<UserOrderPlace />} />
          <Route
            path="/admin/banner-upload"
            element={<AdminBannerUploader />}
          />
          <Route path="/admin/stock" element={<AdminProductStock />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/orders" element={<MyOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/offers" element={<MyOffer />} />
          <Route path="/offers" element={<UserSideBar />} />
          <Route path="/address" element={<MyAddress />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout/shipping" element={<CheckoutShipping />} />
          <Route path="/checkout/bill" element={<CheckoutBill />} />
          <Route path="/checkout/order" element={<CheckoutOrder />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          

          {/* <Route
            path="/all-products"
            element={<ProductPage category="all" />}
          /> */}
          <Route
            path="/all-products"
            element={<ProductCard category="all" />}
          />
          <Route path="/products/stationary" element={<Products category="Stationary" />} />
          <Route
            path="/cleaning-products"
            element={<ProductCard category="cleaning" />}
          />
          <Route
            path="/admin"
            element={
              userRole === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
      <CheckoutPage />
      {showLoginModal && <LoginModal setShowLoginModal={setShowLoginModal} />}
      <ForgotPasswordModal />
    </div>
  );
}

export default App;
