import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // Make sure this path is correct

// The category structure is defined here, directly in the frontend.
const categories = {
  "FIGURES": [
    { name: "Politics & Leadership", value: "politics_leadership" },
    { name: "Science & Technology", value: "science_technology" },
    { name: "Arts & Culture", value: "arts_culture" },
  ],
  "EVENTS": [
    { name: "Conflicts & Warfare", value: "conflicts_warfare" },
    { name: "Political & Social Transformations", value: "political_social_transformations" },
    { name: "Exploration & Discovery", value: "exploration_discovery" },
  ],
  "PLACES": [
    { name: "Ancient Cities", value: "ancient_cities" },
    { name: "Monuments & Structures", value: "monuments_structures" },
    { name: "Lost Civilizations", value: "lost_civilizations" },
  ],
};

const AddArticlePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a subcategory.");
      return;
    }
    
    let articleType = '';
    // Find which main category the selection belongs to
    for (const parent in categories) {
        if (categories[parent].some(sub => sub.value === selectedCategory)) {
            articleType = parent.toLowerCase();
            // Your API uses 'people' but the form uses 'figures', so we adjust
            if (articleType === 'figures') {
                articleType = 'people';
            }
            break;
        }
    }

    if (!articleType) {
        alert("An invalid category was selected. Please try again.");
        return;
    }

    const formData = new FormData();
    // Use field names that match your database tables
    formData.append('name', title);
    formData.append('description', description);
    formData.append('bio', description); // Send to both, controller will use what it needs
    formData.append('category', selectedCategory);
    formData.append('status', status);
    if (image) {
      formData.append('picture', image); // Send to both, controller will use what it needs
      formData.append('portrait_url', image);
    }

    try {
      // Dynamically post to the correct endpoint (e.g., /people, /places, /events)
      await axiosClient.post(`/${articleType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Article submitted successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to submit article:", error);
      alert("Error submitting article. Check the console for details.");
    }
  };

  return (
    <div className="form-container">
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
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
            className="form-select"
          >
            <option value="" disabled>Select a Category</option>
            {Object.keys(categories).map(parentName => (
              <optgroup label={parentName.toUpperCase()} key={parentName}>
                {categories[parentName].map(subcategory => (
                  <option key={subcategory.value} value={subcategory.value}>
                    {subcategory.name}
                  </option>
                ))}
              </optgroup>
            ))}
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