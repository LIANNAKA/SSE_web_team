import React, { useEffect, useState } from "react";
import defaultBanner from "../assets/offerbanner.png";

const Banner = () => {
  const [banners, setBanners] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/api/banner')
    .then((res) => res.json())
    .then((data) => setBanners(data))
    .catch((err) => console.error("Failed to load banners", err));
}, []);


  if (banners.length === 0) {
    return ( 
      <div className="carousel-item active">
        <img src={defaultBanner} className="d-block w-100 " alt="Default Banner" />
      w  <h2 className="banner-title">Welcome</h2>
      </div>
    );
  }

  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-wrap="true" data-bs-pause="false">
      {banners.length > 0 && (
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
      )}

      <div className="carousel-inner">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img
                src={`http://localhost:5000${banner.image}`}
                className="d-block w-100 banner-img"
                alt={`Banner ${index + 1}`}
              />
              {/* <h2 className="banner-title text-center">{banner.title}</h2> */}
            </div>
          ))
        ) : (
          <div className="carousel-item active">
            <img src={defaultBanner} className="d-block w-100" alt="Default Banner" />
            <h2 className="banner-title text-center">Welcome</h2>
          </div>
        )}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Banner;
