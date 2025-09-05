import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddArticlePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // 'People', 'Places', 'Events'
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    // e.g., axios.post('/api/articles', { title, description, category, status, image });
    console.log({ title, description, category, status, image });
    alert("Article submission (simulated). Check console for data.");
    // After submission, navigate back to the admin dashboard or a success page
    navigate("/admin");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="form-container">
      {" "}
      {/* Reusing your existing form-container style */}
      <h1>ADD NEW ARTICLE</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
            className="form-textarea" // You might need to add this style to index.css
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="form-select" // You might need to add this style to index.css
          >
            <option value="">Select a Category</option>
            <option value="FIGURES">FIGURES</option>
            <option value="EVENTS">EVENTS</option>
            <option value="PLACES">PLACES</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
        <button type="submit" className="form-button">
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default AddArticlePage;
