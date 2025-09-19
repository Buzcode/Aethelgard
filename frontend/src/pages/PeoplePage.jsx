// Correctly merged code for PeoplePage.jsx
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

        const peopleWithLikeStatus = peopleResponse.data.map(person => ({
            ...person,
            is_liked: person.is_liked || false,
        }));
        setPeople(peopleWithLikeStatus);


        // This is the CORRECT line
        setPeople(peopleResponse.data);


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

  const handleLikeClick = async (e, personId) => {
    e.stopPropagation();

  const handleLikeClick = async (personId) => {
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
    try {

      await axiosClient.post(`/figures/${personId}/like`);
      
      // This was already here and is correct!
      window.dispatchEvent(new CustomEvent('recommendations-changed'));
      
    } catch (error)  {

      await axiosClient.post(`/people/${personId}/like`);
    } catch (error) {

      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setPeople(originalPeople);
    }
  };


  const handleSaveClick = async (e, personId) => {
    e.stopPropagation();

  const handleSaveClick = async (personId) => {

    if (!user) {
      setWarning({ id: personId, message: 'Please log in to save posts' });
      setTimeout(() => setWarning({ id: null, message: '' }), 3000);
      return;
    }
    const originalSavedIds = new Set(savedIds);
    const newSavedIds = new Set(savedIds);
    let action = newSavedIds.has(personId) ? 'unsaved' : 'saved';
    newSavedIds.has(personId) ? newSavedIds.delete(personId) : newSavedIds.add(personId);
    setSavedIds(newSavedIds);
    try {
      await axiosClient.post('/saved-articles/toggle', {
        article_id: personId,
        article_type: 'people',
      });
      
      // --- RECOMMENDATION LOGIC ADDED ---
      // After a successful save, tell the app to refresh recommendations.
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

              <li key={person.id} className="list-item-card" onClick={() => navigate(`/figures/${person.id}`)}>
                {person.picture ? (
                  <img
                    className="item-image"
                    src={`http://127.0.0.1:8000/storage/${person.picture}`}
                    alt={`Portrait of ${person.name}`}
                  />
                ) : (
                  <div className="item-image-placeholder"></div>
                )}

              <li key={person.id} className="list-item-card">
                {person.picture && <img className="item-image" src={`/storage/${person.picture}`} alt={`Portrait of ${person.name}`} />}

                <div className="item-content">
                  <h3>{person.name}</h3>
                  <p>{person.bio}</p>
                </div>
                <div className="item-actions">

                  <div className="save-action" onClick={(e) => handleSaveClick(e, person.id)}>
                    {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                  </div>
                  <div className="like-action" onClick={(e) => handleLikeClick(e, person.id)}>
                    {person.is_liked ? <FaHeart size={20} color="red" /> : <FaRegHeart size={20} />}
                    {person.likes > 0 && <span className="like-count">{person.likes}</span>}
                    {warning.id === person.id && (
                      <div className="like-warning">{warning.message}</div>
                    )}

                  <div className="save-action" onClick={() => handleSaveClick(person.id)}>
                    {isSaved ? <FaBookmark size={24} /> : <FaRegBookmark size={24} />}
                  </div>
                  <div className="like-action">
                    <div className="like-button" onClick={() => handleLikeClick(person.id)}>
                      {person.is_liked ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                      {person.likes > 0 && <span className="like-count">{person.likes}</span>}
                    </div>
                    {warning.id === person.id && <div className="like-warning">{warning.message}</div>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No historical figures found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PeoplePage;