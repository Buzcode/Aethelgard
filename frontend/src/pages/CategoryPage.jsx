import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { type, categorySlug } = useParams();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a title from the slug, e.g., "conflicts_warfare" -> "Conflicts Warfare"
  const title = categorySlug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = `http://localhost:8000/api/${type}?category=${categorySlug}`;
      
      try {
        const response = await axios.get(apiUrl);
        setItems(response.data);
      } catch (err) {
        setError(`Failed to fetch data. Please try again later. Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, categorySlug]);

  if (isLoading) {
    return <div className="container"><h2>Loading {title}...</h2></div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="category-page-container">
      <h1>{title}</h1>
      
      {items.length === 0 ? (
        <p>No items found in this category.</p>
      ) : (
        <div className="items-list">
          {items.map(item => (
            <div key={item.id} className="item-card-simple">
              
              {(item.picture || item.portrait_url) && (
                <img src={`http://localhost:8000/storage/${item.picture || item.portrait_url}`} alt={item.name} />
              )}
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>{item.description || item.bio}</p>
                {item.event_date && <p><strong>Date:</strong> {item.event_date}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default CategoryPage; 