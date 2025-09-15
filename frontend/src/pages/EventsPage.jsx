import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/events');
        const eventsData = response.data.map(event => ({ ...event, is_liked: event.is_liked || false }));
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical events.');
        console.error('API Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  const handleLikeClick = (eventId) => {
    if (!user) {
      setWarning({ id: eventId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    // ... Like logic for logged-in users
    const originalEvents = [...events];
    const eventToUpdate = originalEvents.find(e => e.id === eventId);
    if (!eventToUpdate) return;
    setEvents(currentEvents =>
      currentEvents.map(event =>
        event.id === eventId
          ? { ...event, is_liked: !event.is_liked, likes: event.is_liked ? event.likes - 1 : event.likes + 1 }
          : event
      )
    );
    try {
      axiosClient.post(`/events/${eventId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setEvents(originalEvents);
    }
  };

  const handleSaveClick = (eventId) => {
    if (!user) {
      setWarning({ id: eventId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    alert(`Save functionality for event #${eventId} is coming soon!`);
  };

  if (loading) { return <p>Loading historical events...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Events</h1>
      {events.length > 0 ? (
        <ul className="item-list">
          {events.map((event) => (
            <li key={event.id} className="list-item-card">
              {event.picture && (
                <img
                  className="item-image"
                  src={`http://127.0.0.1:8000/storage/${event.picture}`}
                  alt={`Depiction of ${event.name}`}
                />
              )}
              <div className="item-content">
                <h3>{event.name}</h3>
                <p>{event.description}</p>
              </div>

              {/* === THE ONLY CHANGE IS HERE === */}
              {/* We have swapped the order of the 'save-action' and 'like-action' divs. */}
              <div className="item-actions">
                {/* Save action is now FIRST, so it appears on the left */}
                <div className="save-action" onClick={() => handleSaveClick(event.id)}>
                  <FaRegBookmark size={24} />
                </div>

                {/* Like action is now SECOND, so it appears on the right */}
                <div className="like-action">
                  <div className="like-button" onClick={() => handleLikeClick(event.id)}>
                    {event.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                    {event.likes > 0 && <span className="like-count">{event.likes}</span>}
                  </div>
                  {warning.id === event.id && (
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
        <p>No historical events found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default EventsPage;