import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AdminBannerUploader = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
  try {
    const res = await axiosInstance.get("/banner"); 
    setBanners(res.data);
  } catch (err) {
    console.error("Error fetching banners:", err);
  }
};


  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      alert("Please provide title and image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      await axiosInstance.post("/banner", formData, {
       headers: {
        "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setImage(null);
      document.querySelector('input[type="file"]').value = "";
      fetchBanners();
      alert("Banner uploaded successfully");
    } catch (err) {
      console.error("Error uploading banner:", err);
      alert("Failed to upload banner");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Banner Upload</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Banner Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Upload Banner
        </button>
      </form>

      <h4>Uploaded Banners</h4>
      <div className="row">
        {banners.map((banner) => (
          <div key={banner._id} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={`http://localhost:5000${banner.image}`}
                className="card-img-top"
                alt={banner.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{banner.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBannerUploader;
