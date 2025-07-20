import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) + delta, 1),
    }));
  };

  // const handleAddToCart = (product) => {
  //   setCart((prev) => ({
  //     ...prev,
  //     [product.productId]: {
  //       ...product,
  //       quantity: quantities[product.productId] || 1,
  //     },
  //   }));
  //   alert(`${product.name} added to cart!`);
  // };

  // And modify the add to cart:
const handleAddToCart = (product) => {
  alert(`${product.name} added to cart!`);
};
  return (
    <div className="container mt-4">
      <div className="row">
        {products.map((product) => (
          <div key={product.productId} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="fw-bold">₹{product.price}</p>

                <div className="d-flex align-items-center mb-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantityChange(product.productId, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{quantities[product.productId] || 1}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleQuantityChange(product.productId, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleAddToCart(product)}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
