import React, { useState } from "react";
import axios from "axios";

const AdminBannerUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("banner", image);

    try {
      await axios.post("/api/banner/upload", formData);
      alert("Banner uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Banner upload failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="p-4 shadow rounded"
    >
      <h3>Upload New Banner</h3>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {preview && (
        <img
          src={preview}
          alt="Banner Preview"
          style={{ width: "100%", marginTop: "1rem" }}
        />
      )}
      <button type="submit" className="btn btn-success mt-3">
        Upload Banner
      </button>
    </form>
  );
};

export default AdminBannerUpload;
