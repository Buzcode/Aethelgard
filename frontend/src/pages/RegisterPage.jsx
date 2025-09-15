import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // <-- Import Link
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'; // <-- Import new icons

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);

  // v-- NEW STATE FOR PASSWORD VISIBILITY (ONE FOR EACH FIELD) --v
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    // ... (rest of the submit logic is the same)
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      navigate('/');
    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.errors) {
            const serverErrors = Object.values(err.response.data.errors).flat().join(' ');
            setError(serverErrors || 'Registration failed. Please check your input.');
        } else {
            setError('An unexpected error occurred.');
        }
    }
  };

  return (
    <div className="form-container">
      {/* v-- NEW: BACK ARROW --v */}
      <Link to="/" className="back-arrow-link" aria-label="Go back to homepage">
        <FaArrowLeft />
      </Link>

      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        {/* v-- NEW: WRAPPER AND TOGGLE ICON FOR PASSWORD --v */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? 'text' : 'password'}
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* v-- NEW: WRAPPER AND TOGGLE ICON FOR CONFIRM PASSWORD --v */}
        <div className="form-group">
          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <div className="password-input-wrapper">
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              id="passwordConfirmation" 
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)} 
              required 
            />
            <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterPage;