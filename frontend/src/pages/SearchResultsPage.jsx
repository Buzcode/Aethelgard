// src/pages/SearchResultsPage.jsx

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const SearchResultsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/search?query=${query}`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, user]);

  // --- NEW: Function to log an article click for trending topics ---
  const handleArticleClick = (type, id) => {
    try {
      axiosClient.post('/track-click', { type, id });
    } catch (error) {
      console.error("Failed to log click:", error);
    }
  };

  const handleLikeClick = (itemType, itemId) => {
    if (!user) {
      setWarning({ id: `${itemType}-${itemId}`, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }

    const originalResults = [...results];
    setResults(currentResults =>
      currentResults.map(item =>
        (item.id === itemId && item.type === itemType)
          ? { ...item, is_liked: !item.is_liked, likes: item.is_liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
    try {
      axiosClient.post(`/${itemType}/${itemId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setResults(originalResults);
    }
  };

  const handleSaveClick = (itemType, itemId) => {
    if (!user) {
      setWarning({ id: `${itemType}-${itemId}`, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    alert(`Save functionality for item #${itemId} is coming soon!`);
  };

  if (loading) {
    return <div className="list-page-container"><h2>Searching for "{query}"...</h2></div>;
  }

  if (error) {
    return <div className="list-page-container error-message">{error}</div>;
  }

  return (
    <div className="list-page-container">
      <h1>Search Results for "{query}"</h1>
      
      {results.length > 0 ? (
        <ul className="item-list">
          {results.map((item) => (
            <li key={`${item.type}-${item.id}`} className="list-item-card">
              
              {/* --- MODIFIED LINK --- */}
              <Link 
                to={`/${item.type}/${item.id}`} 
                className="card-link-wrapper"
                onClick={() => handleArticleClick(item.type, item.id)}
              >
                {(item.picture || item.portrait_url) && (
                  <img
                    className="item-image"
                    src={`/storage/${item.picture || item.portrait_url}`}
                    alt={`Depiction of ${item.name}`}
                  />
                )}
                <div className="item-content">
                  <h3>{item.name}</h3>
                  <p>{item.description || item.bio}</p>
                </div>
              </Link>

              <div className="item-actions">
                <div className="save-action" onClick={() => handleSaveClick(item.type, item.id)}>
                  <FaRegBookmark size={24} />
                </div>
                <div className="like-action">
                  <div className="like-button" onClick={() => handleLikeClick(item.type, item.id)}>
                    {item.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                    {item.likes > 0 && <span className="like-count">{item.likes}</span>}
                  </div>
                  {warning.id === `${item.type}-${item.id}` && (
                    <div className="like-warning">{warning.message}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles found matching your search for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResultsPage;