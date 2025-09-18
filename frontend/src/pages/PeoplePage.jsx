import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PeoplePage = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState({ id: null, message: '' });

  // 1. Add state to track saved article IDs
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 2. Fetch both people and the user's saved articles in parallel
        const [peopleResponse, savedResponse] = await Promise.all([
            axiosClient.get('/people'),
            user ? axiosClient.get('/saved-articles') : Promise.resolve({ data: [] })
        ]);

        setPeople(peopleResponse.data);
        
        // Create a Set of saved IDs for quick lookups
        const savedArticlesSet = new Set(
            savedResponse.data
                .filter(item => item.article_type === 'people') // Filter for this page's type
                .map(item => item.article_id)
        );
        setSavedIds(savedArticlesSet);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical people.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLikeClick = async (personId) => {
    if (!user) {
      setWarning({ id: personId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalPeople = [...people];
    const personToUpdate = originalPeople.find(p => p.id === personId);
    if (!personToUpdate) return;
    setPeople(currentPeople =>
      currentPeople.map(person =>
        person.id === personId
          ? { ...person, is_liked: !person.is_liked, likes: person.is_liked ? person.likes - 1 : person.likes + 1 }
          : person
      )
    );
    try {
      await axiosClient.post(`/people/${personId}/like`);
    } catch (error)  {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPeople(originalPeople);
    }
  };

  // 3. Implement the new handleSaveClick logic
  const handleSaveClick = async (personId) => {
    if (!user) {
      setWarning({ id: personId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }

    const originalSavedIds = new Set(savedIds);
    const newSavedIds = new Set(savedIds);
    let action = '';

    // Optimistic UI Update
    if (newSavedIds.has(personId)) {
        newSavedIds.delete(personId);
        action = 'unsaved';
    } else {
        newSavedIds.add(personId);
        action = 'saved';
    }
    setSavedIds(newSavedIds);

    // API Call
    try {
      await axiosClient.post('/saved-articles/toggle', {
        article_id: personId,
        article_type: 'people', // Correct type for this page
      });
    } catch (error) {
      console.error(`Failed to ${action} person:`, error);
      setSavedIds(originalSavedIds); // Revert on failure
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
            // 4. Check if the current person is saved
            const isSaved = savedIds.has(person.id);
            return (
              <li key={person.id} className="list-item-card">
                {person.picture && (
                  <img
                    className="item-image"
                    src={`http://127.0.0.1:8000/storage/${person.picture}`}
                    alt={`Portrait of ${person.name}`}
                  />
                )}
                <div className="item-content">
                  <h3>{person.name}</h3>
                  <p>{person.bio}</p>
                </div>
                <div className="item-actions">
                  <div className="save-action" onClick={() => handleSaveClick(person.id)}>
                    {/* Render filled or empty bookmark based on isSaved status */}
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                  </div>
                  <div className="like-action">
                    <div className="like-button" onClick={() => handleLikeClick(person.id)}>
                      {person.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                      {person.likes > 0 && <span className="like-count">{person.likes}</span>}
                    </div>
                    {warning.id === person.id && (
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
        <p>No historical people found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PeoplePage;