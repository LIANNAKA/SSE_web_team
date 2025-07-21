import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const MyAddress = () => {
  const [address, setAddress] = useState("");
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAddress(res.data.address || "");
        setUpdatedAddress(res.data.address || "");
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to fetch address");
        setLoading(false);
      });
  }, []);

  const handleUpdate = () => {
    axios
      .put(
        "http://localhost:5000/api/users/update-address",
        { address: updatedAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setAddress(updatedAddress);
        setMessage("✅ Address updated successfully!");
      })
      .catch(() => setMessage("❌ Failed to update address"));
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow p-4">
        <h3>My Address</h3>

        <div className="mb-4">
          <p>
            <strong>Saved Address:</strong> {address || "Not Provided"}
          </p>
        </div>

        <Form>
          <Form.Group controlId="address" className="mb-3">
            <Form.Label>
              <strong>Update Address</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={updatedAddress}
              onChange={(e) => setUpdatedAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </Form.Group>

          <Button onClick={handleUpdate} className="mt-2">
            Save Changes
          </Button>
        </Form>

        {message && <Alert className="mt-3">{message}</Alert>}
      </Card>
    </Container>
  );
};

export default MyAddress;
