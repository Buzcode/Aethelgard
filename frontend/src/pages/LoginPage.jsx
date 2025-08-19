import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // To redirect after login

const LoginPage = () => {
  const [email, setEmail] = useState('test@example.com'); // Pre-fill for easy testing
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);

  const { login } = useAuth(); // Get the login function from our context
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/'); // Redirect to the homepage on successful login
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };
  
 return (
  <div className="form-container">
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="form-button">Login</button>
    </form>
  </div>
);
};

export default LoginPage;