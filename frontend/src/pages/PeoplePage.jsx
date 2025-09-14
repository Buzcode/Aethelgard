import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const PeoplePage = () => {
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

        // --- NEW: Initialize the liked state from the API response ---
        // This is the key to solving the refresh problem.
        // We create an object { personId: true, personId2: false, ... }
        // based on the 'is_liked' property sent from the backend.
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
  }, []); // Empty dependency array ensures this runs only on mount

  // --- MODIFIED: The function to handle clicking the like button ---
  const handleLikeClick = async (personId) => {
    // We can still do an optimistic update for a great user experience
    const isCurrentlyLiked = !!likedPeople[personId];
    setLikedPeople(prev => ({ ...prev, [personId]: !prev[personId] }));

    try {
      // --- MODIFICATION: The API call is now simpler ---
      // We no longer need to tell the backend to 'increment' or 'decrement'.
      // The backend will see who the user is and simply "toggle" the like
      // by adding or removing a row from the 'person_likes' pivot table.
      await axiosClient.post(`/people/${personId}/like`);
    } catch (error) {
      console.error('Failed to update like status:', error);
      alert('There was an issue saving your like. Please try again.');
      // If the API call fails, we revert the UI to its original state
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
    <div>
      <h1>Historical Figures</h1>
      {people.length > 0 ? (
        <ul style={{ padding: 0 }}>
          {people.map((person) => (
            <li key={person.id} style={{ marginBottom: '1.5rem', listStyle: 'none', display: 'flex', alignItems: 'flex-start' }}>
              {person.portrait_url && (
                <img
                  src={`http://127.0.0.1:8000/storage/${person.portrait_url}`}
                  alt={`Portrait of ${person.name}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem' }}
                />
              )}
              <div style={{ flexGrow: 1 }}>
                <h3>{person.name}</h3>
                <p>{person.bio}</p>
              </div>

              {/* This JSX part remains the same, but it's now powered by the persistent state */}
              <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div onClick={() => handleLikeClick(person.id)} style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
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