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
    // Define the async function to fetch data
    const fetchPlaces = async () => {
      try {
        // Make the GET request to the /places endpoint
        const response = await axiosClient.get('/places');
        // Update the places state with the data from the response
        setPlaces(response.data);
        // Set loading to false as the data has been fetched
        setLoading(false);
      } catch (err) {
        // If an error occurs, store the error message
        setError('Error fetching historical places. Please try again later.');
        // Set loading to false even if there's an error
        setLoading(false);
        console.error('API Error:', err);
      }
    };

    // Call the function to fetch data
    fetchPlaces();
  }, []); // The empty dependency array ensures this runs only once on mount

   return (
    <div style={{ padding: '20px' }}>
      <h1>Historical Places</h1>

      {/* Display loading message */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display data only if not loading and no error */}
      {!loading && !error && (
        <>
          {/* Check if there are places to display */}
          {places.length > 0 ? (
            <ul>
              {/* Map over the places array and display each one */}
              {places.map((place) => (
                // --- START: MODIFIED CODE BLOCK ---
                <li key={place.id} style={{ marginBottom: '1.5rem', listStyle: 'none', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                  {/* Conditionally render the image if 'picture' field exists */}
                  {place.picture && (
                    <img 
                      src={`http://127.0.0.1:8000/storage/${place.picture}`}  
                      alt={`Image of ${place.name}`} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem', float: 'left', borderRadius: '5px' }} 
                    />
                  )}
                  {/* Changed to h3 to match PeoplePage styling */}
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  {/* Add a clearing div for proper layout with the floated image */}
                  <div style={{ clear: 'both' }}></div>
                </li>
                // --- END: MODIFIED CODE BLOCK ---
              ))}
            </ul>
          ) : (
            // Display message if no places are found
            <p>No historical places found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PlacesPage;