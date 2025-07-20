import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert,Form } from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch user data from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to fetch users: ${err.message}`);
        setLoading(false);
      });
  }, []);

   // Filter users by name or id (case insensitive)
 const filteredUsers = users.filter((user) => {
  const search = searchTerm.toLowerCase();
  return (
    user.name.toLowerCase().includes(search) ||
    user.userId?.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );
});

  return (
    <div>
      <h2 className="mb-4">User List</h2>

      {/* 🔍 Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search by Name or ID"
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <Spinner animation="border" variant="primary" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && users.length === 0 && (
        <Alert variant="info">No users found.</Alert>
      )}

      {!loading && users.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
               <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Registered Date</th>
                <th>Registered Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => {
            const dateTime = new Date(user.createdAt);
            return (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile || "-"}</td>
                <td>{dateTime.toLocaleDateString()}</td>
                <td>{dateTime.toLocaleTimeString()}</td>
              </tr>
            );})}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserList;