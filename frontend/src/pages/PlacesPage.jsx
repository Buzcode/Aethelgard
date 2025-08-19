import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const PlacesPage = () => {
  // State for storing the list of places
  const [places, setPlaces] = useState([]);
  // State for tracking the loading status
  const [loading, setLoading] = useState(true);
  // State for storing any potential errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true); // Set loading to true when starting the fetch
        const response = await axiosClient.get('/places');
        setPlaces(response.data);
        setError(null); // Clear any previous errors on success
      } catch (err) {
        setError('Failed to fetch historical places.');
        console.error('API Error fetching places:', err);
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or fail)
      }
    };

    fetchPlaces();
  }, []); // The empty dependency array ensures this runs only once on mount

  // --- Conditional Rendering ---

  // 1. Render loading state
  if (loading) {
    return <p>Loading historical places...</p>;
  }

  // 2. Render error state
  if (error) {
    return <p style={{ color: '#800020' }}>{error}</p>;
  }

  // 3. Render the main content
  return (
    <div>
      <h1>Historical Places</h1>
      {places.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {places.map((place) => (
            <li key={place.id} style={{ marginBottom: '1.5rem', listStyle: 'none', overflow: 'hidden' }}>
              {place.picture && (
                <img 
                  src={`http://127.0.0.1:8000/storage/${place.picture}`} 
                  alt={`View of ${place.name}`} 
                  style={{ width: '150px', height: '100px', objectFit: 'cover', marginRight: '1rem', float: 'left' }} 
                />
              )}
              <h3>{place.name}</h3>
              <p>{place.description}</p>
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