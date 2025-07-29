import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleProductCard from "../SingleProductCard";

const StationaryProduct = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const filtered = res.data.filter((p) => p.category === "Stationary");

        setProducts(filtered);

        // Init quantities
        const initialQuantities = {};
        filtered.forEach((prod) => {
          initialQuantities[prod.productId] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleBuy = async (product) => {
    const quantity = quantities[product.productId];
    try {
      await axios.post("http://localhost:5000/api/cart", {
        productId: product.productId,
        quantity,
      });
      alert(`Purchase successful for ${product.name}`);
    } catch (err) {
      console.error("Purchase failed", err);
      alert("Purchase Failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Stationary Products</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={product.productId}>
            <SingleProductCard
              product={product}
              quantity={quantities[product.productId]}
              onBuy={handleBuy}
              onQuantityChange={handleQuantityChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationaryProduct;