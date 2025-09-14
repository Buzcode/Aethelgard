import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Ensure FaRegBookmark is imported

const PlacesPage = () => {
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

        // --- NEW: Initialize the liked state from the API response ---
        // This is the key to solving the refresh problem.
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
  }, []); // Empty dependency array ensures this runs only on mount

  // --- MODIFIED: The function to handle clicking the like button ---
  const handleLikeClick = async (placeId) => {
    const isCurrentlyLiked = !!likedPlaces[placeId];
    // Optimistic UI update
    setLikedPlaces(prev => ({ ...prev, [placeId]: !prev[placeId] }));

    try {
      // --- MODIFICATION: The API call is now simpler ---
      // The backend now handles the "toggle" logic based on the user.
      await axiosClient.post(`/places/${placeId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      // Revert the UI on failure
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
    <div>
      <h1>Historical Places</h1>
      {places.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {places.map((place) => (
            <li key={place.id} style={{ marginBottom: '1.5rem', listStyle: 'none', display: 'flex', alignItems: 'flex-start' }}>
              {place.picture && (
                <img
                  src={`http://127.0.0.1:8000/storage/${place.picture}`}
                  alt={`View of ${place.name}`}
                  style={{ width: '150px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                />
              )}
              <div style={{ flexGrow: 1 }}>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
              </div>
              <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div onClick={() => handleLikeClick(place.id)} style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
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