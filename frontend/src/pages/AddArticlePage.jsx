import React, { useState, useEffect } from "react";
// --- MODIFIED ---: Import useParams to read the URL
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

// --- ADDED ---: Helper function to find the parent category from a subcategory value
const findParentCategory = (subcategoryValue) => {
  for (const parent in categories) {
    if (categories[parent].some(sub => sub.value === subcategoryValue)) {
      return parent;
    }
  }
  return "";
};


const AddArticlePage = () => {
  // --- ADDED ---: Get URL parameters and determine if we are in edit mode
  const { type, id } = useParams();
  const isEditMode = !!id; // If there's an ID in the URL, this will be true

  // --- MODIFIED ---: Renamed state for clarity and added loading/error states
  const [formData, setFormData] = useState({
    name: "",
    description: "", // This will hold 'bio' for figures
    category: "",
    // Add any other fields like 'event_date' if you have them
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(isEditMode); // Start loading if in edit mode
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  // --- ADDED ---: useEffect to fetch data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Map the URL type 'people' back to 'FIGURES' for our internal logic
      const endpointMap = { people: 'people', places: 'places', events: 'events' };
      const endpoint = endpointMap[type];

      if (!endpoint) {
          setError("Invalid article type in URL.");
          setLoading(false);
          return;
      }
      
      setLoading(true);
      axiosClient.get(`/${endpoint}/${id}`)
        .then(({ data }) => {
          // The 'people' table returns 'bio', others return 'description'.
          // We handle this by setting a single 'description' field in our state.
          const descriptionOrBio = data.bio || data.description;

          setFormData({
            name: data.name,
            description: descriptionOrBio,
            category: data.category
          });

          // Pre-fill the category dropdowns based on the fetched data
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
    // Reset the subcategory when the parent changes
    setFormData(prev => ({ ...prev, category: "" }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Please select a subcategory.");
      return;
    }
    
    // Determine the correct API endpoint
    const endpointMap = {
      FIGURES: 'people',
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

    if (endpoint === 'people') {
      submissionData.append('bio', formData.description); 
    } else {
      submissionData.append('description', formData.description);
    }
    
    try {
      if (isEditMode) {
        // --- EDIT LOGIC ---
        // For FormData updates, Laravel needs a POST request with a _method field
        submissionData.append('_method', 'PUT');
        await axiosClient.post(`/${endpoint}/${id}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Article updated successfully!");
      } else {
        // --- ADD LOGIC ---
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

  // --- ADDED ---: Loading and Error UI states
  if (loading) return <div>Loading article details...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;

  return (
    <div className="form-container">
      {/*  Title is now dynamic */}
      <h1>{isEditMode ? "EDIT ARTICLE" : "ADD NEW ARTICLE"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Title</label>
          {/*  All inputs now use the formData state object */}
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
          {/*Button text is now dynamic */}
          {isEditMode ? "Update Article" : "Submit Article"}
        </button>
      </form>
    </div>
  );
};

export default AddArticlePage;