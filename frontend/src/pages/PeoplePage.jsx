import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PeoplePage = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Add the 'warning' state, just like in EventsPage
  const [warning, setWarning] = useState({ id: null, message: '' });

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        // The backend should already send the correct is_liked and likes count
        const response = await axiosClient.get('/people');
        setPeople(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical people.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, [user]); // Add user as a dependency to refetch data on login/logout

  const handleLikeClick = async (personId) => {
    // 2. Add check to see if the user is logged in
    if (!user) {
      setWarning({ id: personId, message: 'Please log in to like posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return; // Stop the function here
    }

    // This is the optimistic update for logged-in users
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
      // The actual API call
      await axiosClient.post(`/people/${personId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPeople(originalPeople); // Revert on failure
    }
  };

  // 3. Add the handleSaveClick function
  const handleSaveClick = (personId) => {
    if (!user) {
      setWarning({ id: personId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    // Placeholder for actual save logic
    alert(`Save functionality for person #${personId} is coming soon!`);
  };

  if (loading) { return <p>Loading historical figures...</p>; }
  if (error) { return <p style={{ color: '#800020' }}>{error}</p>; }

  return (
    <div className="list-page-container">
      <h1>Historical Figures</h1>
      {people.length > 0 ? (
        <ul className="item-list">
          {people.map((person) => (
            <li key={person.id} className="list-item-card">
              {person.portrait_url && (
                <img
                  className="item-image"
                  src={`http://127.0.0.1:8000/storage/${person.portrait_url}`}
                  alt={`Portrait of ${person.name}`}
                />
              )}
              <div className="item-content">
                <h3>{person.name}</h3>
                <p>{person.bio}</p>
              </div>

              {/* 4. Replace the old JSX with this new structure for alignment */}
              <div className="item-actions">
                <div className="save-action" onClick={() => handleSaveClick(person.id)}>
                  <FaRegBookmark size={24} />
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
          ))}
        </ul>
      ) : (
        <p>No historical people found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PeoplePage;