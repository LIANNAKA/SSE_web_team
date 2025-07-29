import React, { useEffect, useState } from "react";
import Banner from "../component/banner";
import ProductCard from "../component/ProductCard";
import axios from "axios";

const Home = () => {
  const [homeProducts, setHomeProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        const filtered = res.data.filter(
          (p) =>
            Array.isArray(p.displayLocations) &&
            p.displayLocations.includes("home")
        );
        setHomeProducts(filtered);
      })
      .catch((err) => console.error("Failed to fetch home products", err));
  }, []);

  return (
    <div>
      <Banner />
      <ProductCard products={homeProducts} />
    </div>
  );
};

export default Home;