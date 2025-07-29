// SingleProductCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const SingleProductCard = ({ product, quantity, onBuy, onQuantityChange }) => {
  return (
    <Card className="h-100 shadow-sm" style={{ maxWidth: "250px", margin: "0 auto" }}>
      <Card.Img
        variant="top"
        src={`http://localhost:5000${product.imageUrl}`}
        alt={product.name}
        style={{ height: "150px", objectFit: "cover" }}
        onError={(e) => { e.target.src = "/default-product.png"; }}
      />
      <Card.Body>
        <Card.Title className="fs-6">
          <Link to={`/product/${product.productId}`} style={{ textDecoration: "none" }}>
            {product.name}
          </Link>
        </Card.Title>
        <Card.Text className="mb-1 text-muted">Price: ₹{product.price}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <Button size="sm" onClick={() => onQuantityChange(product.productId, -1)}>-</Button>
          <span>{quantity}</span>
          <Button size="sm" onClick={() => onQuantityChange(product.productId, 1)}>+</Button>
        </div>

        <Button className="mt-2" size="sm" onClick={() => onBuy(product)}>Buy</Button>
      </Card.Body>
    </Card>
  );
};

export default SingleProductCard;