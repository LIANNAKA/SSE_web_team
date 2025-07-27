import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-0 mt-5">
      <div className="container text-md-left">
        <div className="row">
          {/* Company Section */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Our Services</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-white text-decoration-none">Affiliate Program</a></li>
              <li>
                <div className="admin-link ">
                    <Link to="/adminlogin" className="admin-button text-white text-decoration-none ">
                      Admin
                    </Link>
                </div>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Get Help</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text-white text-decoration-none">Shipping</a></li>
              <li><a href="#" className="text-white text-decoration-none">Returns</a></li>
              <li>
                <div>
                  <Link to="/adminorderstatus" className="text-white text-decoration-none">
                    Orders
                  </Link>
                </div>
              </li>
              <li><a href="#" className="text-white text-decoration-none">Payment Options</a></li>
            </ul>
          </div>

          {/* Shop Section */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Online Shop</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Stationary</a></li>
              <li><a href="#" className="text-white text-decoration-none">Cleaning Material</a></li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-md-0 mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Follow Us</h5>
            <div>
              <a href="#" className="text-white me-4 fs-5"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-4 fs-5"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-4 fs-5"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-4 fs-5"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
