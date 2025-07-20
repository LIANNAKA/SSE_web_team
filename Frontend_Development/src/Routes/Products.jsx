import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [stationary, setStationary] = useState([]);
  const [cleaning, setCleaning] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setStationary(data.filter((item) => item.category === "stationary"));
        setCleaning(data.filter((item) => item.category === "cleaning"));
      })
      .catch((err) => console.error("Error fetching products:", err));
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

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🖊️ Stationary Products</h2>
      {stationary.length > 0 ? (
        renderProducts(stationary)
      ) : (
        <p>No stationary products found.</p>
      )}

      <hr className="my-5" />

      <h2 className="mb-3">🧼 Cleaning Products</h2>
      {cleaning.length > 0 ? (
        renderProducts(cleaning)
      ) : (
        <p>No cleaning products found.</p>
      )}
    </div>
  );
};

export default ProductPage;
