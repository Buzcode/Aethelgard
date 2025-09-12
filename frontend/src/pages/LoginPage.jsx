import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const loggedInUser = await login(email, password);
      
      // Navigate based on user role
      if (loggedInUser && loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        // Navigate to a default dashboard or home page for other users
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login failed:", err);
      // error message
      const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    }
  };
  
  return (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;