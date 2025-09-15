import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Use axiosClient for consistency
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const CategoryPage = () => {
  const { user } = useAuth();
  const { type, categorySlug } = useParams();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });

  // Create a more readable title from the slug, e.g., "conflicts_warfare" -> "Conflicts & Warfare"
  const title = categorySlug
    .replace(/_/g, ' & ')
    .replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      // The API endpoint is dynamically constructed from the URL params
      const apiUrl = `/${type}?category=${categorySlug}`;
      
      try {
        const response = await axiosClient.get(apiUrl);
        setItems(response.data);
      } catch (err) {
        setError(`Failed to fetch data. Please try again later.`);
        console.error("API Error fetching category data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, categorySlug, user]); // Re-fetch if the user logs in/out

  const handleLikeClick = (itemId) => {
    if (!user) {
      setWarning({ id: itemId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }

    const originalItems = [...items];
    const itemToUpdate = originalItems.find(i => i.id === itemId);
    if (!itemToUpdate) return;

    // Optimistic UI update
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, is_liked: !item.is_liked, likes: item.is_liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );

    // API call to sync the like status
    try {
      axiosClient.post(`/${type}/${itemId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setItems(originalItems); // Revert on failure
    }
  };

  const handleSaveClick = (itemId) => {
    if (!user) {
      setWarning({ id: itemId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    alert(`Save functionality for item #${itemId} is coming soon!`);
  };

  if (isLoading) {
    return <div className="list-page-container"><h2>Loading {title}...</h2></div>;
  }

  if (error) {
    return <div className="list-page-container error-message">{error}</div>;
  }

  return (
    <div className="list-page-container">
      <h1>{title}</h1>
      
      {items.length === 0 ? (
        <p>No items found in this category.</p>
      ) : (
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="list-item-card">
              
              {/* Image */}
              {(item.picture || item.portrait_url) && (
                <img 
                  className="item-image"
                  src={`http://127.0.0.1:8000/storage/${item.picture || item.portrait_url}`} 
                  alt={`Depiction of ${item.name}`} 
                />
              )}

              {/* Content */}
              <div className="item-content">
                <h3>{item.name}</h3>
                <p>{item.description || item.bio}</p>
              </div>

              {/* Actions */}
              <div className="item-actions">
                <div className="save-action" onClick={() => handleSaveClick(item.id)}>
                  <FaRegBookmark size={24} />
                </div>
                <div className="like-action">
                  <div className="like-button" onClick={() => handleLikeClick(item.id)}>
                    {item.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                    {item.likes > 0 && <span className="like-count">{item.likes}</span>}
                  </div>
                  {warning.id === item.id && (
                    <div className="like-warning">
                      {warning.message}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;