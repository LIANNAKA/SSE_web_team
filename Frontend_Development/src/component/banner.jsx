import React, { useEffect, useState } from "react";
import defaultBanner from "../assets/offerbanner.png";

const Banner = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/banner")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Failed to load banners", err));
  }, []);

  useEffect(() => {
    const carouselEl = document.querySelector("#carouselExampleIndicators");
    if (carouselEl) {
      new window.bootstrap.Carousel(carouselEl, {
        interval: 3000,
        ride: "carousel",
        wrap: true,
        pause: false,
      });
    }
  }, [banners]);

  if (banners.length === 0) {
    return (
      <div className="carousel-item active">
        <img
          src={defaultBanner}
          className="d-block w-100"
          alt="Default Banner"
        />
        <h2 className="banner-title text-center">Welcome</h2>
      </div>
    );
  }

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide mb-5"
      data-bs-ride="carousel"
      data-bs-interval="3000"
      data-bs-wrap="true"
      data-bs-pause="false"
    >
      <div className="carousel-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={`http://localhost:5000${banner.image}`}
              className="d-block w-100 banner-img"
              alt={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
