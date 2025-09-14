import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedEvents, setLikedEvents] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/events');
        const eventsData = response.data;
        setEvents(eventsData);

        // --- NEW: Initialize the liked state from the API response ---
        // Solves the refresh problem by checking what the user has already liked.
        const initialLikes = eventsData.reduce((acc, event) => {
          acc[event.id] = event.is_liked;
          return acc;
        }, {});
        setLikedEvents(initialLikes);

        setError(null);
      } catch (err) {
        setError('Failed to fetch historical events.');
        console.error('API Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures this runs only on mount

  // --- MODIFIED: The function to handle clicking the like button ---
  const handleLikeClick = async (eventId) => {
    const isCurrentlyLiked = !!likedEvents[eventId];
    // Optimistic UI update
    setLikedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));

    try {
      // --- MODIFICATION: The API call is now simpler ---
      // No need to send 'action', the backend handles the toggle.
      await axiosClient.post(`/events/${eventId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      // Revert the UI change on failure
      setLikedEvents(prev => ({ ...prev, [eventId]: isCurrentlyLiked }));
    }
  };

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
            <li key={event.id} style={{ marginBottom: '1.5rem', listStyle: 'none', display: 'flex', alignItems: 'flex-start' }}>
              {event.picture && (
                <img
                  src={`http://127.0.0.1:8000/storage/${event.picture}`}
                  alt={`Depiction of ${event.name}`}
                  style={{ width: '150px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                />
              )}
              <div style={{ flexGrow: 1 }}>
                <h3>{event.name}</h3>
                {event.event_date && <p><strong>Date:</strong> {event.event_date}</p>}
                <p>{event.description}</p>
              </div>
              <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div onClick={() => handleLikeClick(event.id)} style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  {likedEvents[event.id] ? (
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
        <p>No historical events found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default EventsPage;