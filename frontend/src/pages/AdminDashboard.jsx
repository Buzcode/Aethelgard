import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const handleDelete = async (articleId, articleType) => {
    if (!window.confirm("Are you sure you want to permanently delete this article?")) {
      return;
    }
    const endpointMap = {
      FIGURES: 'figures',
      PLACES: 'places',
      EVENTS: 'events'
    };
    const endpoint = `/${endpointMap[articleType]}/${articleId}`;
    if (!endpointMap[articleType]) {
        alert('Cannot delete: Unknown article type.');
        return;
    }
    try {
      await axiosClient.delete(endpoint);
      setArticles(currentArticles =>
        currentArticles.filter(article => !(article.id === articleId && article.type === articleType))
      );
      alert("Article deleted successfully.");
    } catch (error) {
      console.error("Failed to delete the article:", error);
      alert("An error occurred. The article could not be deleted.");
    }
  };

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
            <li><Link to="/admin">ALL ARTICLES</Link></li>
            <li><Link to="/">VIEW SITE</Link></li>
            {/* --- THIS IS THE CORRECTED LINE --- */}
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
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => {
                  const typeUrlMap = {
                    FIGURES: 'figures',
                    PLACES: 'places',
                    EVENTS: 'events'
                  };
                  const articleUrlType = typeUrlMap[article.type];
                  
                  return (
                    <tr key={`${article.type}-${article.id}`}>
                      <td><input type="checkbox" /></td>
                      <td>{article.name}</td>
                      <td>{article.type}</td>
                      <td className="action-cell">
                        <Link
                          to={`/admin/edit/${articleUrlType}/${article.id}`}
                          className="action-icon edit-icon"
                          title="Edit"
                        >
                          ✏️
                        </Link>
                        <span
                          className="action-icon delete-icon"
                          onClick={() => handleDelete(article.id, article.type)}
                          style={{ cursor: 'pointer' }}
                          title="Delete"
                        >
                          🗑️
                        </span>
                        <Link
                          to={`/${articleUrlType}/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-icon view-icon"
                          title="View Public Page"
                        >
                          👁️
                        </Link>
                      </td>
                    </tr>
                  );
                })
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