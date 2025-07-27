import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products/all")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load product list.", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.productId.toString().includes(searchTerm)
  );

  return (
    <div>
      <h3 className="mb-4">Product List</h3>
      {/* 🔍 Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text className="bg-primary text-white">
          <FaSearch />
        </InputGroup.Text>
      </InputGroup>

      {loading && <Spinner animation="border" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && products.length === 0 && (
        <Alert variant="info">No products found.</Alert>
      )}

      {!loading && filteredProducts.length > 0 && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock Left</th>
              <th>Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod, idx) => (
              <tr key={prod.productId}>
                <td>{idx + 1}</td>
                <td>{prod.productId}</td>
                <td>{prod.name}</td>
                <td>{prod.category}</td>
                <td>{prod.price}</td>
                <td>{prod.stock}</td>
                <td>{prod.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProductList;
