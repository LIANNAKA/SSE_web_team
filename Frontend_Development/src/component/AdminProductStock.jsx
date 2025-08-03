import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import PurchaseMessage from "./PurchaseMessage"; // ✅ import it

const AdminProductStock = () => {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ message state

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/products/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleStockChange = (id, value) => {
    setStockInputs({ ...stockInputs, [id]: value });
  };

  const handleUpdateStock = async (id) => {
    const inputValue = parseInt(stockInputs[id]);
    if (isNaN(inputValue)) {
      alert("Please enter a valid number");
      return;
    }

    const currentProduct = products.find((p) => p.productId === id);
    const newStock = currentProduct.stock + inputValue;

    if (newStock < 0) {
      alert("Stock insufficient. You cannot reduce below current stock.");
      return;
    }

    try {
      await axiosInstance.put(`/products/update-by-productid/${id}`, {
        stock: newStock,
      });

      setStockInputs({ ...stockInputs, [id]: "" });
      fetchProducts();
      const action = inputValue > 0 ? "increased" : "reduced";
      setSuccessMessage(
        `Stock for "${currentProduct.name}" ${action} by ${Math.abs(
          inputValue
        )}.`
      );
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const filteredProducts = products.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.category &&
        prod.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Product Stock Management</h2>

      {/* ✅ Show success message */}
      {successMessage && (
        <PurchaseMessage
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* 🔍 Search Bar */}
      <InputGroup className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text className="bg-primary text-white">
          <FaSearch />
        </InputGroup.Text>
      </InputGroup>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Update Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.productId}>
                  <td>{prod.name}</td>
                  <td>{prod.category || "N/A"}</td>
                  <td>{prod.stock}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control mb-1"
                      value={stockInputs[prod.productId] || ""}
                      onChange={(e) =>
                        handleStockChange(prod.productId, e.target.value)
                      }
                      placeholder="± Quantity"
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdateStock(prod.productId)}
                    >
                      Update
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

export default AdminProductStock;
