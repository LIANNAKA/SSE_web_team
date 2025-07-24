import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import axiosInstance from "../../axiosInstance";

const MyAddress = () => {
  const [address, setAddress] = useState("");
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [company, setCompany] = useState("");
  const [updatedCompany, setUpdatedCompany] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [updatedCompanyAddress, setUpdatedCompanyAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTab, setSelectedTab] = useState("user");
  const [isCompanyUser, setIsCompanyUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login first.");
      setLoading(false);
      return;
    }
    axiosInstance
      .get("/users/profile")
      .then((res) => {
        setAddress(res.data.address || "");
        setUpdatedAddress(res.data.address || "");
        setCompany(res.data.company || "");
        setUpdatedCompany(res.data.company || "");
        setCompanyAddress(res.data.companyAddress || "");
        setUpdatedCompanyAddress(res.data.companyAddress || "");
        setLoading(false);
      })
      .catch(() => {
        setMessage("❌ Failed to fetch profile data");
        setLoading(false);
      });
  }, []);

  const handleUpdateUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login first to update address.");
      return;
    }

    axiosInstance
      .put("/users/update-address-company", { address: updatedAddress })
      .then(() => {
        setAddress(updatedAddress);
        setMessage("✅ Address updated successfully!");
      })
      .catch(() => {
        setMessage("❌ Failed to update address");
      });
  };

  const handleUpdateCompany = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Please login first to update company info.");
      return;
    }
    axiosInstance
      .put("/users/update-address-company", {
        company: updatedCompany,
        companyAddress: updatedCompanyAddress,
      })
      .then(() => {
        setCompany(updatedCompany);
        setCompanyAddress(updatedCompanyAddress);
        setMessage("✅ Company info updated!");
      })
      .catch(() => {
        setMessage("❌ Failed to update company info");
      });
  };

  // Disable Company tab if checkbox not checked
  const handleTabSelect = (tab) => {
    if (tab === "company" && !isCompanyUser) return;
    setSelectedTab(tab);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <Card className="shadow p-4">
        <ButtonGroup className="mb-4 w-100">
          <Button
            variant={selectedTab === "user" ? "primary" : "outline-primary"}
            onClick={() => handleTabSelect("user")}
            style={{ width: "50%" }}
          >
            User Address
          </Button>
          <Button
            variant={selectedTab === "company" ? "primary" : "outline-primary"}
            onClick={() => handleTabSelect("company")}
            style={{ width: "50%" }}
            disabled={!isCompanyUser}
          >
            Company Address
          </Button>
        </ButtonGroup>

        {selectedTab === "user" && (
          <Form>
            <Form.Group controlId="userAddress" className="mb-3">
              <Form.Label>
                <strong>Your Address</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
                placeholder="Enter your address"
              />
              <div className="text-muted mt-2">
                Saved: {address || "Not Provided"}
              </div>
            </Form.Group>
            <div className="mb-2" style={{ fontSize: "14px" }}>
              If you are from a company, check the box below to enter company
              address.
            </div>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isCompanyUser"
                label="Company Address"
                checked={isCompanyUser}
                onChange={(e) => {
                  setIsCompanyUser(e.target.checked);
                  if (e.target.checked) {
                    setSelectedTab("company"); // Auto-switch to company tab
                  } else if (selectedTab === "company") {
                    setSelectedTab("user"); // Return to user tab
                  }
                }}
              />
            </Form.Group>
            <Button onClick={handleUpdateUser} className="mt-2" type="button">
              Save Changes
            </Button>
          </Form>
        )}

        {selectedTab === "company" && (
          <Form>
            <Form.Group controlId="companyName" className="mb-3">
              <Form.Label>
                <strong>Company Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={updatedCompany}
                onChange={(e) => setUpdatedCompany(e.target.value)}
                placeholder="Enter company name"
              />
              <div className="text-muted mt-2">
                Saved: {company || "Not Provided"}
              </div>
            </Form.Group>
            <Form.Group controlId="companyAddress" className="mb-3">
              <Form.Label>
                <strong>Company Address</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={updatedCompanyAddress}
                onChange={(e) => setUpdatedCompanyAddress(e.target.value)}
                placeholder="Enter company address"
              />
              <div className="text-muted mt-2">
                Saved: {companyAddress || "Not Provided"}
              </div>
            </Form.Group>
            <Button
              onClick={handleUpdateCompany}
              className="mt-2"
              type="button"
            >
              Save Company Info
            </Button>
          </Form>
        )}

        {message && <Alert className="mt-3">{message}</Alert>}
      </Card>
    </Container>
  );
};

export default MyAddress;
