import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!loggedInUser || !token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/profile/${loggedInUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch user profile.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4">
        <Row className="align-items-center">
          <Col md={4} className="text-center mb-4 mb-md-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </Col>

          <Col md={8}>
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.mobile}</p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default MyProfile;
