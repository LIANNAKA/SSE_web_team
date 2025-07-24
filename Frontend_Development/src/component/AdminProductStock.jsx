import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const AdminProductStock = () => {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState("")

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
    const updatedStock = parseInt(stockInputs[id]);

    if (isNaN(updatedStock) || updatedStock < 0) {
      alert("Please enter a valid non-negative number");
      return;
    }

    try {
      await axiosInstance.put(`/api/products/update-by-productid/${id}`, { stock: updatedStock });
      fetchProducts(); // Refresh updated data
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prod.category && prod.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container my-4">
      <h2 className="mb-4">Product Stock Management</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by product name or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                    onChange={(e) => handleStockChange(prod.productId, e.target.value)}
                    placeholder="New quantity"
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