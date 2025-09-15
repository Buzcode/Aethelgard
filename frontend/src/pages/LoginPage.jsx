import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'; // <-- Import new icons

const LoginPage = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // v-- NEW STATE FOR PASSWORD VISIBILITY --v
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const loggedInUser = await login(email, password);
      
      if (loggedInUser && loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
    }
  };
  
  return (
    <div className="form-container">
      {/* v-- NEW: BACK ARROW --v */}
      <Link to="/" className="back-arrow-link" aria-label="Go back to homepage">
        <FaArrowLeft />
      </Link>

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

        {/* v-- NEW: WRAPPER AND TOGGLE ICON FOR PASSWORD --v */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'} // Dynamically change type
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span 
              className="password-toggle-icon" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;