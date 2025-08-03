import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-0 mt-5">
      <Container>
        {/* First Row: Footer Content + Map */}
        <Row>
          {/* Company Section */}
          <Col md={3} lg={2} xl={2} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Our Services</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-white text-decoration-none">Affiliate Program</a></li>
              {/* <li>
                <Link to="/adminlogin" className="admin-button text-white text-decoration-none">Admin</Link>
              </li> */}
            </ul>
          </Col>

          {/* Help Section */}
          <Col md={2} lg={2} xl={2} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Get Help</h5>
            <ul className="list-unstyled">
              {/* <li><a href="#" className="text-white text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text-white text-decoration-none">Shipping</a></li>
              <li><a href="#" className="text-white text-decoration-none">Returns</a></li> */}
              <li>Email ID</li>
              <li>Contact Us</li>
              {/* <li><Link to="/adminorderstatus" className="text-white text-decoration-none">Orders</Link></li>
              <li><a href="#" className="text-white text-decoration-none">Payment Options</a></li> */}
            </ul>
          </Col>

          {/* Shop Section */}
          <Col md={3} lg={2} xl={2} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Online Shop</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Stationary</a></li>
              <li><a href="#" className="text-white text-decoration-none">Cleaning Material</a></li>
            </ul>
          </Col>

          {/* Social Links */}
          <Col md={4} lg={2} xl={2} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-4">Follow Us</h5>
            <div>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-3 fs-5"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </Col>

          {/* Map Section (Side-by-side with border and rounded corners) */}
          <Col md={12} lg={4} xl={4} className="mb-4">
            <h5 className="text-uppercase fw-bold mb-3 text-center">Office Location</h5>
            <div className="border rounded overflow-hidden shadow-sm" style={{ height: "200px" }}>
              <iframe
                title="office-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d506.57838743243605!2d76.99253118583378!3d28.458552001809977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d17a521c0a303%3A0x8416cd822c3eb5e4!2sShree%20shyam%20enterprises!5e0!3m2!1sen!2sin!4v1754036659735!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Col>
        </Row>

        {/* Bottom Note */}
        <Row className="mt-3">
          <Col className="text-center">
            <p>&copy; 2025 Your Website. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
