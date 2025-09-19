import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PlacesPage = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [placesResponse, savedResponse] = await Promise.all([
            axiosClient.get('/places'),
            user ? axiosClient.get('/saved-articles') : Promise.resolve({ data: [] })
        ]);

        setPlaces(placesResponse.data);

        const savedArticlesSet = new Set(
            savedResponse.data
                .filter(item => item.article_type === 'places')
                .map(item => item.article_id)
        );
        setSavedIds(savedArticlesSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical places.');
        console.error('API Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLikeClick = async (placeId) => {
    if (!user) {
      setWarning({ id: placeId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalPlaces = [...places];
    setPlaces(currentPlaces =>
      currentPlaces.map(place =>
        place.id === placeId
          ? { ...place, is_liked: !place.is_liked, likes: place.is_liked ? place.likes - 1 : place.likes + 1 }
          : place
      )
    );
    try {
      await axiosClient.post(`/places/${placeId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPlaces(originalPlaces);
    }
  };

  const handleSaveClick = async (placeId) => {
    if (!user) {
      setWarning({ id: placeId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalSavedIds = new Set(savedIds);
    const newSavedIds = new Set(savedIds);
    let action = newSavedIds.has(placeId) ? 'unsaved' : 'saved';
    newSavedIds.has(placeId) ? newSavedIds.delete(placeId) : newSavedIds.add(placeId);
    setSavedIds(newSavedIds);
    try {
      await axiosClient.post('/saved-articles/toggle', {
        article_id: placeId,
        article_type: 'places',
      });
    } catch (error) {
      console.error(`Failed to ${action} place:`, error);
      setSavedIds(originalSavedIds);
      alert('There was an issue saving this item. Please try again.');
    }
  };

  if (loading) { return <p>Loading historical places...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Places</h1>
      {places.length > 0 ? (
        <ul className="item-list">
          {places.map((place) => {
            const isSaved = savedIds.has(place.id);
            return (
              <li key={place.id} className="list-item-card">
                {/* --- THIS IS THE CORRECTED LINE --- */}
                {place.picture && <img className="item-image" src={place.picture} alt={`View of ${place.name}`} />}
                
                <div className="item-content">
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                </div>
                <div className="item-actions">
                  <div className="save-action" onClick={() => handleSaveClick(place.id)}>
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                  </div>
                  <div className="like-action">
                    <div className="like-button" onClick={() => handleLikeClick(place.id)}>
                      {place.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                      {place.likes > 0 && <span className="like-count">{place.likes}</span>}
                    </div>
                    {warning.id === place.id && <div className="like-warning">{warning.message}</div>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No historical places found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PlacesPage;