import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PeoplePage = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPeople, setLikedPeople] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/people');
        const peopleData = response.data;
        setPeople(peopleData);

        const initialLikes = peopleData.reduce((acc, person) => {
          acc[person.id] = person.is_liked;
          return acc;
        }, {});
        setLikedPeople(initialLikes);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch historical people.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  const handleLikeClick = async (personId) => {
    const isCurrentlyLiked = !!likedPeople[personId];
    setLikedPeople(prev => ({ ...prev, [personId]: !prev[personId] }));

    try {
      await axiosClient.post(`/people/${personId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      setLikedPeople(prev => ({ ...prev, [personId]: isCurrentlyLiked }));
    }
  };

  if (loading) {
    return <p>Loading historical figures...</p>;
  }

  if (error) {
    return <p style={{ color: '#800020' }}>{error}</p>;
  }

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

              {user && (
                <div className="item-actions">
                  <div onClick={() => handleLikeClick(person.id)}>
                    {likedPeople[person.id] ? (
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
        <p>No historical people found. An admin needs to add some!</p>
      )}
    </div>
  );
};

export default PeoplePage;