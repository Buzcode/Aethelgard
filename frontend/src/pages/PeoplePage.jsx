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

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
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

  const handleSaveClick = (personId) => {
    if (!user) {
      setWarning({ id: personId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
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
              {/* === THIS IS THE CORRECTED SECTION === */}
              {person.picture && (
                <img
                  className="item-image"
                  src={`/storage/${person.picture}`}
                  alt={`Portrait of ${person.name}`}
                />
              )}
              {/* === END OF CORRECTED SECTION === */}
              <div className="item-content">
                <h3>{person.name}</h3>
                <p>{person.bio}</p>
              </div>

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