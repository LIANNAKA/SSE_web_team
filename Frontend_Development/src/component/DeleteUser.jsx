import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const DeleteUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });
  

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const token = localStorage.getItem("adminToken");
  const fetchUsers = () => {
    setLoading(true);
    
    axios.get("http://localhost:5000/api/admin/all-users", {
        headers: { Authorization: `Bearer ${token}` }
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg({ type: "success", text: "User deleted successfully" });
      fetchUsers(); // Refresh user list
    } catch {
      setMsg({ type: "danger", text: "Failed to delete user" });
    }
  };

  return (
    <div>
      <h3 className="mb-4">Delete User</h3>

      {msg.text && <Alert variant={msg.type}>{msg.text}</Alert>}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered striped hover>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th> 
              <th>Address</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile || "-"}</td>  
                <td>{u.address || "-"}</td> 
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(u._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DeleteUser;
