import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import UserSidebar from "./UserSidebar";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/offers")
      .then((res) => {
        setOffers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setError("Failed to load offers. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <UserSidebar />

      <Container className="my-4 flex-grow-1">
        <h2 className="mb-4 fw-bold">Available Offers</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {offers.length === 0 ? (
            <p>No offers available at the moment.</p>
          ) : (
            offers.map((offer, index) => (
              <Col key={index} md={6} lg={4} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="text-primary fw-semibold">
                      {offer.title}
                    </Card.Title>
                    <Card.Text>{offer.description}</Card.Text>
                    <Card.Text className="text-success fw-bold">
                      {offer.discount}% Off
                    </Card.Text>
                    <Card.Text className="text-muted">
                      Valid till: {new Date(offer.validTill).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default MyOffers;
