import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
 
const PeoplePage = () => {
  // State for storing the list of people
  const [people, setPeople] = useState([]);
  // State for managing loading status
  const [loading, setLoading] = useState(true);
  // State for storing any errors
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
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
  }, []); // The empty dependency array means this runs only once on mount

  // Render loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Render the list of people
  return (
    <div>  
      <h1>Historical People</h1>
      {people.length > 0 ? (
        <ul>
          {people.map((person) => (
            <li key={person.id} style={{ marginBottom: '1.5rem', listStyle: 'none' }}>
  {person.portrait_url && (
    <img 
       src={`http://127.0.0.1:8000/storage/${person.portrait_url}`}  
      alt={`Portrait of ${person.name}`} 
      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '1rem', float: 'left' }} 
    />
  )}
  <h3>{person.name}</h3>
  <p>{person.bio}</p>
  <div style={{ clear: 'both' }}></div>
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