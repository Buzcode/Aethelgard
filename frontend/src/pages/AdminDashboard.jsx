import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All"); // Default filter

  // Default data to mimic your provided image
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "FRENCH REVOLUTION",
      category: "EVENTS",
      status: "PUBLISHED",
    },
    {
      id: 2,
      title: "Leonardo Da Vinci Biography",
      category: "FIGURES",
      status: "DRAFT",
    },
    // Add more default articles here if you wish
  ]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      article.category === filter ||
      article.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-page-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <button onClick={toggleSidebar} className="sidebar-toggle-button">
          {isSidebarOpen ? "◀" : "▶"}
        </button>
        <div className="sidebar-content">
          <h3>ADMIN</h3>
          <ul className="admin-nav-list">
            <li>
              <Link to="/admin/articles">ALL ARTICLES</Link>
            </li>
            <li>
              <Link to="/admin/categories">CATEGORIES</Link>
            </li>
            <li>
              <Link to="/">VIEW SITE</Link>
            </li>
            <li>
              <Link to="/logout">LOG OUT</Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`admin-main-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="admin-header-welcome">
          <h2>WELCOME. MITU!</h2>
          <Link to="/admin/add-article" className="add-new-article-button">
            + ADD NEW ARTICLE
          </Link>
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
            <select
              className="admin-filter-dropdown"
              onChange={handleFilterChange}
              value={filter}
            >
              <option value="All">SEARCH BY FILTER</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="EVENTS">Events</option>
              <option value="FIGURES">Figures</option>
              <option value="PLACES">Places</option>
            </select>
            {/* You can add a custom arrow here if needed */}
            <span className="admin-filter-arrow"></span>
          </div>
        </div>

        <div className="admin-articles-table-container">
          <table className="admin-articles-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{article.title}</td>
                  <td>{article.category}</td>
                  <td>{article.status}</td>
                  <td>
                    <span className="action-icon edit-icon">✏️</span>
                    <span className="action-icon delete-icon">🗑️</span>
                    <span className="action-icon view-icon">👁️</span>
                  </td>
                </tr>
              ))}
              {/* Add empty rows to match the visual length of your example */}
              {Array.from({
                length:
                  5 - filteredArticles.length > 0
                    ? 5 - filteredArticles.length
                    : 0,
              }).map((_, index) => (
                <tr key={`empty-${index}`} className="empty-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
