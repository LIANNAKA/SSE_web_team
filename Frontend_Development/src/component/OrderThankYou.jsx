// src/component/OrderThankYou.jsx
import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderThankYou = () => {
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate("/userdashboard", { state: { section: "order" } });
  };

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <Card className="p-5 text-center shadow-lg">
        <h2 className="mb-3 text-success">🎉 Thank You for Your Order!</h2>
        <p className="lead">Your order has been successfully placed.</p>
        <Button variant="primary" className="mt-4" onClick={goToOrders}>
          Go to My Orders
        </Button>
      </Card>
    </Container>
  );
};

export default OrderThankYou;
