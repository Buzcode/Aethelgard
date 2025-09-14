import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PlacesPage = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPlaces, setLikedPlaces] = useState({});

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/places');
        const placesData = response.data;
        setPlaces(placesData);

        const initialLikes = placesData.reduce((acc, place) => {
          acc[place.id] = place.is_liked;
          return acc;
        }, {});
        setLikedPlaces(initialLikes);

        setError(null);
      } catch (err) {
        setError('Failed to fetch historical places.');
        console.error('API Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleLikeClick = async (placeId) => {
    const isCurrentlyLiked = !!likedPlaces[placeId];
    setLikedPlaces(prev => ({ ...prev, [placeId]: !prev[placeId] }));

    try {
      await axiosClient.post(`/places/${placeId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setLikedPlaces(prev => ({ ...prev, [placeId]: isCurrentlyLiked }));
    }
  };

  if (loading) {
    return <p>Loading historical places...</p>;
  }

  if (error) {
    return <p style={{ color: '#800020' }}>{error}</p>;
  }

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

              {user && (
                <div className="item-actions">
                  <div onClick={() => handleLikeClick(place.id)}>
                    {likedPlaces[place.id] ? (
                      <FaHeart size={24} color="red" />
                    ) : (
                      <FaRegHeart size={24} color="black" />
                    )}
                  </div>
                  <div>
                    <FaRegBookmark size={24} color="black" />
                  </div>
                </div>
              )}
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