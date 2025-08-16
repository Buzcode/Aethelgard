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
        // Make the GET request to the /events endpoint
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

  // We will add the JSX to display the data in the next step
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
          {/* Check if there are events to display */}
          {events.length > 0 ? (
            <ul>
              {/* Map over the events array and display each one */}
              {events.map((event) => (
                <li key={event.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                  <h2>{event.name}</h2>
                  <p>
                    <strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}
                  </p>
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            // Display message if no events are found
            <p>No historical events found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;