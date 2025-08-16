import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const EventsPage = () => {
  // State for storing the list of events
  const [events, setEvents] = useState([]);
  // State for tracking the loading status
  const [loading, setLoading] = useState(true);
  // State for storing any potential errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Define the async function to fetch data
    const fetchEvents = async () => {
      try {
        const response = await axiosClient.get('/events');
        // Update the events state with the data from the response
        setEvents(response.data);
        // Set loading to false as the data has been fetched
        setLoading(false);
      } catch (err) {
        // If an error occurs, store the error message
        setError('Error fetching historical events. Please try again later.');
        // Set loading to false even if there's an error
        setLoading(false);
        console.error('API Error:', err);
      }
    };

    // Call the function to fetch data
    fetchEvents();
  }, []); // The empty dependency array ensures this runs only once on mount

  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Historical Events</h1>

      {/* Display loading message */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display data only if not loading and no error */}
      {!loading && !error && (
        <>
          {events.length > 0 ? (
            <ul>
              {/* Map over the events array and display each one */}
              {events.map((event) => (
                <li key={event.id} style={{ marginBottom: '1.5rem', listStyle: 'none', borderBottom: '1px solid #444', paddingBottom: '1rem', overflow: 'hidden' }}>
                  
                  {/* Conditionally render the image if event.picture exists */}
                  {event.picture && (
                    <img 
                      src={`http://127.0.0.1:8000/storage/${event.picture}`}  
                      alt={`Image of ${event.name}`} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem', float: 'left', borderRadius: '5px' }} 
                    />
                  )}

                  <h2>{event.name}</h2>
                  <p>
                    {/* --- THIS IS THE CORRECTED LINE --- */}
                    <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
                  </p>
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No historical events found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;