import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

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

const findParentCategory = (subcategoryValue) => {
  for (const parent in categories) {
    if (categories[parent].some(sub => sub.value === subcategoryValue)) {
      return parent;
    }
  }
  return "";
};


const AddArticlePage = () => {
  const { type, id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      // --- FIX #1: Change 'people' to 'figures' to match the new API route ---
      const endpointMap = { figures: 'figures', places: 'places', events: 'events' };
      const endpoint = endpointMap[type];

      if (!endpoint) {
          setError("Invalid article type in URL.");
          setLoading(false);
          return;
      }
      
      setLoading(true);
      axiosClient.get(`/${endpoint}/${id}`)
        .then(({ data }) => {
          const descriptionOrBio = data.bio || data.description;

          setFormData({
            name: data.name,
            description: descriptionOrBio,
            category: data.category
          });

          const parentCat = findParentCategory(data.category);
          if (parentCat) {
            setSelectedParentCategory(parentCat);
            setAvailableSubcategories(categories[parentCat]);
          }

          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch article data:", err);
          setError("Could not load article data. It may have been deleted.");
          setLoading(false);
        });
    }
  }, [id, type, isEditMode]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    setFormData(prev => ({ ...prev, category: "" }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a subcategory.");
      return;
    }
    
    // --- FIX #2: Change 'people' to 'figures' to match the new API route ---
    const endpointMap = {
      FIGURES: 'figures',
      PLACES: 'places',
      EVENTS: 'events'
    };
    const endpoint = endpointMap[selectedParentCategory];

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('category', formData.category);
    
    if (image) {
      submissionData.append('picture', image);
    }
    
    // Note: The logic for 'bio' vs 'description' needs a small change
    if (endpoint === 'figures') {
      submissionData.append('bio', formData.description); 
    } else {
      submissionData.append('description', formData.description);
    }
    
    try {
      if (isEditMode) {
        submissionData.append('_method', 'PUT');
        await axiosClient.post(`/${endpoint}/${id}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Article updated successfully!");
      } else {
        await axiosClient.post(`/${endpoint}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Article submitted successfully!");
      }
      navigate("/admin");

    } catch (error) {
      console.error("Failed to submit article:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
      }
      alert("Error submitting article. Check the console for details.");
    }
  };

  if (loading) return <div>Loading article details...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;

  return (
    <div className="form-container">
      <h1>{isEditMode ? "EDIT ARTICLE" : "ADD NEW ARTICLE"}</h1>
      <form onSubmit={handleSubmit}>
        {/* The rest of your JSX form remains exactly the same */}
        <div className="form-group">
          <label htmlFor="name">Title</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="5" required className="form-textarea" />
        </div>

        <div className="form-group">
          <label htmlFor="parent-category">Category</label>
          <select
            id="parent-category"
            value={selectedParentCategory}
            onChange={handleParentCategoryChange}
            required
            disabled={isEditMode} 
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
            <label htmlFor="category">Subcategory</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={isEditMode} 
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
          <label htmlFor="image">Image {isEditMode && "(Leave blank to keep existing)"}</label>
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
          {isEditMode ? "Update Article" : "Submit Article"}
        </button>
      </form>
    </div>
  );
};

export default AddArticlePage;