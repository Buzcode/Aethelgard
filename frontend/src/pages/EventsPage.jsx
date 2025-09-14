import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const EventsPage = () => {
  const { user } = useAuth();
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
  }, []);

  const handleLikeClick = async (eventId) => {
    const isCurrentlyLiked = !!likedEvents[eventId];
    setLikedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));

    try {
      await axiosClient.post(`/events/${eventId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
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
                {event.event_date && <p><strong>Date:</strong> {event.event_date}</p>}
                <p>{event.description}</p>
              </div>

              {user && (
                <div className="item-actions">
                  <div onClick={() => handleLikeClick(event.id)}>
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
              )}
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