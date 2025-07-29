import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ConfirmDialog from "./ConfirmDialog";
import StatusMessage from "./StatusMessage";

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setMsg({ type: "danger", text: "Failed to fetch users" });
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg({ type: "success", text: "User deleted successfully" });
      fetchUsers();
    } catch {
      setMsg({ type: "danger", text: "Failed to delete user" });
    }
    setShowConfirm(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.mobile?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="container my-4">
      <h3 className="mb-4">Delete User</h3>

      {/* 🔍 Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, or mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text className="bg-primary text-white">
          <FaSearch />
        </InputGroup.Text>
      </InputGroup>

      {/* ✅ Status Message */}
      {msg.text && (
        <StatusMessage
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
        />
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : filteredUsers.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table bordered striped hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile || "-"}</td>
                <td>{u.address || "-"}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedUserId(u._id);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* ✅ Confirmation Dialog */}
      <ConfirmDialog
        show={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedUserId(null);
        }}
        onConfirm={() => handleDelete(selectedUserId)}
        title="Delete Confirmation"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
};

export default DeleteUser;
