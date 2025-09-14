import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // Make sure this path is correct

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
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const navigate = useNavigate();

  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleParentCategoryChange = (e) => {
    const parentValue = e.target.value;
    setSelectedParentCategory(parentValue);

    if (parentValue) {
      setAvailableSubcategories(categories[parentValue]);
    } else {
      setAvailableSubcategories([]);
    }
    setSelectedSubcategory("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubcategory) {
      alert("Please select a subcategory.");
      return;
    }
    
    // Determine the correct API endpoint
    let articleType = selectedParentCategory.toLowerCase();
    const endpoint = articleType === 'figures' ? 'people' : articleType;

    // --- MODIFICATION START: Build FormData intelligently based on category ---
    const formData = new FormData();
    formData.append('name', title);
    formData.append('category', selectedSubcategory); // Send the subcategory value
    
    if (image) {
      formData.append('picture', image);
    }

    // Add fields ONLY for the correct endpoint
    if (endpoint === 'people') {
      // The 'people' table expects 'bio', not 'description'
      formData.append('bio', description); 
    } else {
      // 'places' and 'events' tables expect 'description'
      formData.append('description', description);
    }
    

    try {
      await axiosClient.post(`/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Article submitted successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Failed to submit article:", error);
      // Log more detailed error information if it's available
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      alert("Error submitting article. Check the console for details.");
    }
  };

  return (
    <div className="form-container">
      <h1>ADD NEW ARTICLE</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required className="form-textarea" />
        </div>

        <div className="form-group">
          <label htmlFor="parent-category">Category</label>
          <select
            id="parent-category"
            value={selectedParentCategory}
            onChange={handleParentCategoryChange}
            required
            className="form-select"
          >
            <option value="">Select a Category</option>
            {Object.keys(categories).map(parentName => (
              <option key={parentName} value={parentName}>
                {parentName}
              </option>
            ))}
          </select>
        </div>

        {selectedParentCategory && (
          <div className="form-group">
            <label htmlFor="subcategory">Subcategory</label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a Subcategory</option>
              {availableSubcategories.map(subcategory => (
                <option key={subcategory.value} value={subcategory.value}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
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