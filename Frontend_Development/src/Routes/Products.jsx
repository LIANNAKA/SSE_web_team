import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductPage = () => {
  const location = useLocation();
  // Determine view type from pathname
let category = "all";
if (location.pathname.includes("stationary-products")) category = "stationary";
else if (location.pathname.includes("cleaning-products")) category = "cleaning";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const renderProducts = (items) => (
    <div className="row">
      {items.map((product) => (
        <div key={product.id} className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <div className="mt-auto">
                <strong>₹{product.price}</strong>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Filter products by category
  let filtered, title;
  if (category === "stationary") {
  filtered = products.filter((p) => (p.category || "").toLowerCase() === "stationary");
  title = "🖊️ Stationary Products";
} else if (category === "cleaning") {
  filtered = products.filter((p) => (p.category || "").toLowerCase() === "cleaning");
  title = "🧼 Cleaning Products";
}

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{title}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length > 0 ? (
        renderProducts(filtered)
      ) : (
        <p>
          {category === "all"
            ? "No products found."
            : `No ${category} products found.`}
        </p>
      )}
    </div>
  );
};

export default ProductPage;