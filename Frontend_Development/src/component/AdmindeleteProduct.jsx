import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { FaSearch } from "react-icons/fa";
import ConfirmDialog from "./ConfirmDialog";
import StatusMessage from "./StatusMessage";

const AdmindeleteProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Show popup dialog
  const requestDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  // Confirm dialog action
  const confirmDelete = async () => {
    try {
      await handleDelete(selectedId);  // Call actual delete handler
      setMessage({ type: "success", text: "Product deleted successfully" });
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to delete product" }, err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Keep your delete API logic intact
  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Delete Products</h2>

      {/* 🔍 Search Bar */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="input-group-text bg-primary text-white">
          <FaSearch />
        </span>
      </div>

      {/* ✅ Status Message */}
      {message.text && (
        <StatusMessage
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: "", text: "" })}
        />
      )}

      {/* ✅ Confirm Delete Popup */}
      <ConfirmDialog
        show={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.productId}>
                  <td>{prod.name}</td>
                  <td>₹{prod.price}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <button
                      onClick={() => requestDelete(prod.productId)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdmindeleteProducts;
