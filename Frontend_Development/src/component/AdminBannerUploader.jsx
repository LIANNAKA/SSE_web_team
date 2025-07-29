import React, { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";
import StatusMessage from "./StatusMessage";
import axios from "axios";

const AdminBannerUploader = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [banners, setBanners] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/banner");
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
    formData.append("images", image);
    formData.append("titles", JSON.stringify([title]));

    try {
      await axios.post("http://localhost:5000/api/banner/multi", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setImage(null);
      fetchBanners();
      setMsg({ type: "success", text: "Banner uploaded successfully" });
    } catch (err) {
      console.error("Error uploading banner:", err);
      setMsg({ type: "danger", text: "Failed to upload banner" });
    }
  };

  const confirmDeleteBanner = (id) => {
    setSelectedBannerId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/banner/${selectedBannerId}`
      );
      fetchBanners(); // Refresh list
      setMsg({ type: "success", text: "Banner deleted successfully" });
    } catch (err) {
      console.error("Error deleting banner:", err);
      setMsg({ type: "danger", text: "Failed to delete banner" });
    } finally {
      setShowConfirm(false);
      setSelectedBannerId(null);
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
              <div className="card-body d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{banner.title}</h5>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => confirmDeleteBanner(banner._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        show={showConfirm}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedBannerId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this banner?"
      />
      {msg.text && (
        <StatusMessage
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: "", text: "" })}
        />
      )}
    </div>
  );
};

export default AdminBannerUploader;
