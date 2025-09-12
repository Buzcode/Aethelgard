import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient"; 

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // State will now start empty and be filled by the API call.
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all articles when the component loads
  useEffect(() => {
    // Set a timeout to give a better sense of loading, can be removed
    const timer = setTimeout(() => {
      axiosClient.get('/articles')
        .then(({ data }) => {
          setArticles(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch articles:", err);
          setError("Could not load articles from the server.");
          setLoading(false);
        });
    }, 500); 

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); 

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  // Updated filter logic to work with live data
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || article.type === filter;
    return matchesSearch && matchesFilter;
  });

  
  if (loading) return <div>Loading articles...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div className="admin-page-container">
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button onClick={toggleSidebar} className="sidebar-toggle-button">
          {isSidebarOpen ? "◀" : "▶"}
        </button>
        <div className="sidebar-content">
          <h3>ADMIN</h3>
          <ul className="admin-nav-list">
            <li><Link to="/admin/articles">ALL ARTICLES</Link></li>
            <li><Link to="/">VIEW SITE</Link></li>
            <li><Link to="/logout">LOG OUT</Link></li>
          </ul>
        </div>
      </aside>

      <main className={`admin-main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="admin-header-welcome">
          <h2>WELCOME.</h2>
          <Link to="/admin/add-article" className="add-new-article-button">+ ADD NEW ARTICLE</Link>
        </div>

        <div className="admin-search-filter-container">
          <input
            type="text"
            placeholder="SEARCH BY NAME..."
            className="admin-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="admin-filter-dropdown-wrapper">
            {/* Updated filter options to match live data */}
            <select className="admin-filter-dropdown" onChange={handleFilterChange} value={filter}>
              <option value="All">SEARCH BY FILTER</option>
              <option value="FIGURES">Figures</option>
              <option value="EVENTS">Events</option>
              <option value="PLACES">Places</option>
            </select>
            <span className="admin-filter-arrow"></span>
          </div>
        </div>

        <div className="admin-articles-table-container">
          <table className="admin-articles-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>TITLE</th>
                <th>CATEGORY</th>
          
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {/* Logic to handle case where there are no articles */}
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <tr key={`${article.type}-${article.id}`}> {/* A more unique key */}
                    <td><input type="checkbox" /></td>
                    <td>{article.name}</td> 
                    <td>{article.type}</td> 
                    <td>
                      <span className="action-icon edit-icon">✏️</span>
                      <span className="action-icon delete-icon">🗑️</span>
                      <span className="action-icon view-icon">👁️</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;