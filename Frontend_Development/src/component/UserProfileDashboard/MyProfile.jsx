import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from "react-bootstrap";
import axios from "axios";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/profile", {
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

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/user/upload-profile-pic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // update user profile with new image
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-5">
      <Card className="shadow-sm p-4">
        <Row className="align-items-center">
          <Col md={4} className="text-center mb-4 mb-md-0">
            <img
              src={
                user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <Form.Group controlId="formFile">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleImageUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Col>

          <Col md={8}>
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Company:</strong>{user.company}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Company:</strong> {user.company}</p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default MyProfile;