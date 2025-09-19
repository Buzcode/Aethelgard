import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PeoplePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [peopleResponse, savedResponse] = await Promise.all([
          axiosClient.get('/people'),
          user ? axiosClient.get('/saved-articles') : Promise.resolve({ data: [] })
        ]);

        // FIX: Kept the safer version that ensures 'is_liked' exists.
        const peopleWithLikeStatus = peopleResponse.data.map(person => ({
          ...person,
          is_liked: person.is_liked || false,
        }));
        setPeople(peopleWithLikeStatus);

        const savedArticlesSet = new Set(
          savedResponse.data
            .filter(item => item.article_type === 'people')
            .map(item => item.article_id)
        );
        setSavedIds(savedArticlesSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical people.');
        console.error('API Error fetching people:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // FIX: Merged the two function definitions into one correct function.
  const handleLikeClick = async (e, personId) => {
    e.stopPropagation(); // Prevents navigating when clicking the button

    if (!user) {
      setWarning({ id: personId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalPeople = [...people];
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === personId
          ? { ...person, is_liked: !person.is_liked, likes: person.is_liked ? person.likes - 1 : person.likes + 1 }
          : person
      )
    );
    // FIX: Corrected the broken try/catch block.
    try {
      await axiosClient.post(`/people/${personId}/like`);
      window.dispatchEvent(new CustomEvent('recommendations-changed'));
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPeople(originalPeople);
    }
  };

  // FIX: Merged the two function definitions into one correct function.
  const handleSaveClick = async (e, personId) => {
    e.stopPropagation(); // Prevents navigating when clicking the button

    if (!user) {
      setWarning({ id: personId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalSavedIds = new Set(savedIds);
    const newSavedIds = new Set(savedIds);
    const action = newSavedIds.has(personId) ? 'unsaved' : 'saved';
    
    if (action === 'unsaved') {
      newSavedIds.delete(personId);
    } else {
      newSavedIds.add(personId);
    }
    setSavedIds(newSavedIds);

    try {
      await axiosClient.post('/saved-articles/toggle', {
        article_id: personId,
        article_type: 'people',
      });
      window.dispatchEvent(new CustomEvent('recommendations-changed'));
    } catch (error) {
      console.error(`Failed to ${action} person:`, error);
      setSavedIds(originalSavedIds);
      alert('There was an issue saving this item. Please try again.');
    }
  };

  if (loading) { return <p>Loading historical figures...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Figures</h1>
      {people.length > 0 ? (
        <ul className="item-list">
          {people.map((person) => {
            const isSaved = savedIds.has(person.id);
            return (
              // FIX: Merged the two <li> tags. This one is clickable and navigates.
              <li key={person.id} className="list-item-card" onClick={() => navigate(`/figures/${person.id}`)}>
                {/* FIX: Combined the best of both image tags: relative path and a placeholder. */}
                {person.picture ? (
                  <img
                    className="item-image"
                    src={`/storage/${person.picture}`}
                    alt={`Portrait of ${person.name}`}
                  />
                ) : (
                  <div className="item-image-placeholder"></div>
                )}
                
                <div className="item-content">
                  <h3>{person.name}</h3>
                  <p>{person.bio}</p>
                </div>
                
                <div className="item-actions">
                  {/* FIX: Merged the two sets of action buttons. These ones pass the event (e) to stop propagation. */}
                  <div className="save-action" onClick={(e) => handleSaveClick(e, person.id)}>
                    {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                  </div>
                  <div className="like-action" onClick={(e) => handleLikeClick(e, person.id)}>
                    {person.is_liked ? <FaHeart size={20} color="red" /> : <FaRegHeart size={20} />}
                    {person.likes > 0 && <span className="like-count">{person.likes}</span>}
                  </div>
                  {warning.id === person.id && (
                    <div className="like-warning">{warning.message}</div>
                  )}
                </div>
              </li> // FIX: All tags are now properly closed.
            );
          })}
        </ul> // FIX: Added missing closing tag.
      ) : (
        <p>No historical figures found. An admin needs to add some!</p>
      )}
    </div> // FIX: Added missing closing tag.
  );
};

export default PeoplePage;