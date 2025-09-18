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
  
  // 1. Add state to track saved article IDs
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 2. Fetch both events and the user's saved articles in parallel
        const [eventsResponse, savedResponse] = await Promise.all([
            axiosClient.get('/events'),
            user ? axiosClient.get('/saved-articles') : Promise.resolve({ data: [] })
        ]);

        setEvents(eventsResponse.data);
        
        // Create a Set of saved IDs for quick lookups
        const savedArticlesSet = new Set(
            savedResponse.data
                .filter(item => item.article_type === 'events') // Filter for this page's type
                .map(item => item.article_id)
        );
        setSavedIds(savedArticlesSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical events.');
        console.error('API Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLikeClick = (eventId) => {
    if (!user) {
      setWarning({ id: eventId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
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

  // 3. Implement the new handleSaveClick logic
  const handleSaveClick = async (eventId) => {
    if (!user) {
      setWarning({ id: eventId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }

    const originalSavedIds = new Set(savedIds);
    const newSavedIds = new Set(savedIds);
    let action = '';

    // Optimistic UI Update
    if (newSavedIds.has(eventId)) {
        newSavedIds.delete(eventId);
        action = 'unsaved';
    } else {
        newSavedIds.add(eventId);
        action = 'saved';
    }
    setSavedIds(newSavedIds);

    // API Call
    try {
      await axiosClient.post('/saved-articles/toggle', {
        article_id: eventId,
        article_type: 'events', // Correct type for this page
      });
    } catch (error) {
      console.error(`Failed to ${action} event:`, error);
      setSavedIds(originalSavedIds); // Revert on failure
      alert('There was an issue saving this item. Please try again.');
    }
  };

  if (loading) { return <p>Loading historical events...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Events</h1>
      {events.length > 0 ? (
        <ul className="item-list">
          {events.map((event) => {
            // 4. Check if the current event is saved
            const isSaved = savedIds.has(event.id);
            return (
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
                <div className="item-actions">
                  <div className="save-action" onClick={() => handleSaveClick(event.id)}>
                    {/* Render filled or empty bookmark based on isSaved status */}
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                  </div>
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
            );
          })}
        </ul>
      ) : (
        <p>No historical events found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default EventsPage;