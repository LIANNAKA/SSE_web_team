import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Card, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PurchaseMessage from "./PurchaseMessage";

const ProductCard = ({ category = "all" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const [messageData, setMessageData] = useState(null);

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

    fetchProducts();
  }, []);

  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1;
      const product = products.find((p) => p.productId === id);

      if (!product) return prev;

      const newQuantity = currentQuantity + delta;

      // Ensure quantity stays between 1 and available stock
      if (newQuantity < 1) return prev;
      if (newQuantity > product.stock) {
        alert(`Only ${product.stock} units in stock.`);
        return prev;
      }

      return {
        ...prev,
        [id]: newQuantity,
      };
    });
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

      setMessageData({
        type: "success",
        message: `Purchase successful for ${product.name}`,
      });
    } catch (err) {
      console.error("Purchase failed", err);
      alert("Purchase Failed");
    }
  };

  return (
    <div className="px-3">
      {loading && <Spinner animation="border" />}
      {messageData && (
        <PurchaseMessage
          type={messageData.type}
          message={messageData.message}
          onClose={() => setMessageData(null)}
        />
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && products.length === 0 && (
        <Alert variant="info">No products found.</Alert>
      )}

      <Row xs={2} sm={3} md={4} lg={5} className="gy-3 gx-3 gx-sm-3 gx-md-4">
        {products
          .filter((prod) => category === "all" || prod.category === category)
          .map((prod) => (
            <Col key={prod.productId}>
              <Card
                className="h-100 shadow-sm"
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
                      onClick={() => handleQuantityChange(prod.productId, -1)}
                    >
                      -
                    </Button>
                    <span className="mx-2">{quantities[prod.productId]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(prod.productId, 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleBuy(prod)}
                    disabled={
                      prod.stock === 0 ||
                      quantities[prod.productId] > prod.stock
                    }
                  >
                    {prod.stock === 0
                      ? "Out of Stock"
                      : (quantities[prod.productId] ?? 0) > prod.stock
                      ? "Exceeds Stock"
                      : "Buy"}
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
