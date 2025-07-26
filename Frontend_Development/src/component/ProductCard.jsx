import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Card, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ category = "all" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);

        const initialQuantities = {};
        response.data.forEach((prod) => {
          initialQuantities[prod.productId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError("Failed to fetch products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = res.data.map((item) => item.productId);
        setWishlist(ids);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [token]);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleAddToCart = (product, quantity) => {
    console.log("Added to cart:", product.productId, quantity);
  };

  const handleBuy = async (product) => {
    const quantity = quantities[product.productId];
    handleAddToCart(product, quantity);

    try {
      await axiosInstance.post("/cart", {
        productId: product.productId,
        quantity,
      });
      alert("Purchase Successful");
    } catch (err) {
      console.error("Purchase failed", err);
      alert("Purchase Failed");
    }
  };

  const handleWishlistClick = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/users/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          `http://localhost:5000/api/users/wishlist`,
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist((prev) => [...prev, productId]);
        navigate("/wishlist");
      }
    } catch (err) {
      console.error("Wishlist action failed:", err);
    }
  };

  return (
    <div className="px-3">
      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && products.length === 0 && (
        <Alert variant="info">No products found.</Alert>
      )}

      <Row
        xs={2}
        sm={3}
        md={4}
        lg={5}
        className="gy-3 gx-3 gx-sm-3 gx-md-4"
      >
        {products
          .filter((prod) => category === "all" || prod.category === category)
          .map((prod) => (
            <Col key={prod.productId}>
              <Card
                className="h-100 shadow-sm position-relative"
                style={{ width: "100%", maxWidth: "250px", margin: "0 auto" }}
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000${prod.imageUrl}`}
                  alt={prod.name}
                  style={{ height: "150px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/default-product.png";
                  }}
                />

                <button
                  className="btn btn-light position-absolute"
                  onClick={() => handleWishlistClick(prod.productId)}
                  style={{
                    top: "10px",
                    right: "10px",
                    zIndex: 2,
                    borderRadius: "50%",
                    padding: "0.4rem 0.5rem",
                    fontSize: "1.3rem",
                    boxShadow: "0 0 5px #ccc",
                    border: "none",
                  }}
                  title={
                    wishlist.includes(prod.productId)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <i
                    className={
                      wishlist.includes(prod.productId)
                        ? "bi bi-heart-fill"
                        : "bi bi-heart"
                    }
                    style={{
                      color: "#e74c3c",
                      fontSize: "1.3rem",
                    }}
                  ></i>
                </button>

                <Card.Body className="p-2 d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fs-6">
                      <Link
                        to={`/product/${prod.productId}`}
                        style={{ textDecoration: "none" }}
                      >
                        {prod.name}
                      </Link>
                    </Card.Title>

                    <Card.Text
                      className="mb-1 text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Price: ₹{prod.price}
                    </Card.Text>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(prod.productId, -1)
                      }
                    >
                      -
                    </Button>
                    <span className="mx-2">{quantities[prod.productId]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(prod.productId, 1)
                      }
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleBuy(prod)}
                  >
                    Buy
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ProductCard;