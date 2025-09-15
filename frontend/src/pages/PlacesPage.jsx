import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PlacesPage = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Add the 'warning' state
  const [warning, setWarning] = useState({ id: null, message: '' });

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/places');
        setPlaces(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical places.');
        console.error('API Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [user]); // Add user as a dependency

  // IN PlacesPage.jsx - THE CORRECTED CODE

const handleLikeClick = async (placeId) => { // It receives placeId
    // Check if the user is logged in
    if (!user) {
      // Use placeId here
      setWarning({ id: placeId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return; // Stop the function
    }

    // Optimistic update for logged-in users
    const originalPlaces = [...places];
    const placeToUpdate = originalPlaces.find(p => p.id === placeId);
    if (!placeToUpdate) return;

    setPlaces(currentPlaces =>
      currentPlaces.map(place =>
        place.id === placeId // Use placeId here
          ? { ...place, is_liked: !place.is_liked, likes: place.is_liked ? place.likes - 1 : place.likes + 1 }
          : place
      )
    );

    try {
      // The API call is correct
      await axiosClient.post(`/places/${placeId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPlaces(originalPlaces); // Revert on failure
    }
  };

  // 3. Add the handleSaveClick function
  const handleSaveClick = (placeId) => {
    if (!user) {
      setWarning({ id: placeId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    alert(`Save functionality for place #${placeId} is coming soon!`);
  };

  if (loading) { return <p>Loading historical places...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Places</h1>
      {places.length > 0 ? (
        <ul className="item-list">
          {places.map((place) => (
            <li key={place.id} className="list-item-card">
              {place.picture && (
                <img
                  className="item-image"
                  src={`http://127.0.0.1:8000/storage/${place.picture}`}
                  alt={`View of ${place.name}`}
                />
              )}
              <div className="item-content">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>

              {/* 4. Replace the old JSX with this new structure for alignment */}
              <div className="item-actions">
                <div className="save-action" onClick={() => handleSaveClick(place.id)}>
                  <FaRegBookmark size={24} />
                </div>
                <div className="like-action">
                  <div className="like-button" onClick={() => handleLikeClick(place.id)}>
                    {place.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                    {place.likes > 0 && <span className="like-count">{place.likes}</span>}
                  </div>
                  {warning.id === place.id && (
                    <div className="like-warning">
                      {warning.message}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No historical places found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PlacesPage;