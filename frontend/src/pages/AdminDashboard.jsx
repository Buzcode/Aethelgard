import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

// FIX: Renamed component to match the filename and its new purpose.
const AdminDashboard = () => {
  const navigate = useNavigate();

  // FIX: Added state management for the articles list, loading, and errors.
  // This was missing but required for the table from the 'dev' branch to work.
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // You can add filter state later if needed, for now we'll just show all articles.
  const filteredArticles = articles;

  // FIX: Added useEffect to fetch all articles when the component loads.
  useEffect(() => {
    setLoading(true);
    axiosClient.get('/articles') // Assuming you have an endpoint that returns all articles
      .then(({ data }) => {
        setArticles(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch articles:", err);
        setError("Could not load articles. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // FIX: Added the handleDelete function that was being called in the 'dev' branch code.
  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      const typeEndpointMap = {
        FIGURES: 'figures',
        PLACES: 'places',
        EVENTS: 'events'
      };
      const endpoint = typeEndpointMap[type];

      if (!endpoint) {
        alert("Error: Unknown article type.");
        return;
      }
      
      try {
        await axiosClient.delete(`/${endpoint}/${id}`);
        // Refresh the list by removing the deleted article from state
        setArticles(prevArticles => prevArticles.filter(article => !(article.id === id && article.type === type)));
        alert('Article deleted successfully.');
      } catch (err) {
        console.error('Failed to delete article:', err);
        alert('There was an error deleting the article.');
      }
    }
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;

  return (
    // FIX: Changed the main container to be more descriptive of a dashboard.
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        {/* The "Add New" button should navigate to a separate form page */}
        <button onClick={() => navigate('/admin/add')} className="form-button">
          Add New Article
        </button>
      </header>
      
      <main>
        {/* --- MERGE FIX: This is the code block from the 'dev' branch that we are keeping. --- */}
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
                  // A safe mapping from the article type to the URL segment
                  const articleUrlType = typeUrlMap[article.type]?.toLowerCase().replace(' ', '');

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
      {/* --- MERGE FIX: The conflict markers and the code from the 'HEAD' branch have been removed. --- */}
    </div>
  );
};

// FIX: Exporting the correct component name.
export default AdminDashboard;