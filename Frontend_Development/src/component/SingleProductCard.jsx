// SingleProductCard.jsx
import React from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const SingleProductCard = ({ product, quantity, onBuy, onQuantityChange }) => {
  return (
    <Card
      className="h-100 shadow-sm border-2 rounded-4"
      style={{ maxWidth: "260px", margin: "1rem auto" }}
    >
      <Card.Img
        variant="top"
        src={`http://localhost:5000${product.imageUrl}`}
        alt={product.name}
        className="rounded-top"
        style={{ height: "160px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "/default-product.png";
        }}
      />

      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="fs-6 fw-semibold mb-2">
            <Link
              to={`/product/${product.productId}`}
              className="text-decoration-none text-dark"
            >
              {product.name}
            </Link>
          </Card.Title>

          <Card.Text className="text-muted mb-3">
            Price: <strong>₹{product.price}</strong>
          </Card.Text>
        </div>

        <div className="d-flex flex-column align-items-center gap-2 mt-auto">
          <ButtonGroup aria-label="Quantity controls">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onQuantityChange(product.productId, -1)}
            >
              −
            </Button>
            <Button variant="light" size="sm" disabled className="fw-bold">
              {quantity}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onQuantityChange(product.productId, 1)}
            >
              +
            </Button>
          </ButtonGroup>

          <Button
            className="w-100 mt-2"
            size="sm"
            variant="primary"
            onClick={() => onBuy(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SingleProductCard;
