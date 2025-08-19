import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical events.');
        console.error('API Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading historical events...</p>;
  }

  if (error) {
    return <p style={{ color: '#800020' }}>{error}</p>;
  }

return (
    <div>
      <h1>Historical Events</h1>
      {events.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: '1.5rem', listStyle: 'none', overflow: 'hidden' }}>
              {event.picture && (
                <img 
                  src={`http://127.0.0.1:8000/storage/${event.picture}`} 
                  alt={`Depiction of ${event.name}`} 
                  style={{ width: '150px', height: '100px', objectFit: 'cover', marginRight: '1rem', float: 'left' }} 
                />
              )}
              <h3>{event.name}</h3>
              {event.event_date && <p><strong>Date:</strong> {event.event_date}</p>}
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No historical events found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default EventsPage;