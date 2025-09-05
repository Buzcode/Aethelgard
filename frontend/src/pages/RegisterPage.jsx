import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Frontend password match check
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

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
      if (err.response && err.response.status === 422) {
        // A more specific error for email validation
        if (err.response.data.email && err.response.data.email[0].includes('gmail.com')) {
            setError('Registration is only allowed with a gmail.com address.');
        } else {
            setError('Registration failed. Please check your input.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } 
  };

  return (
    <div className="form-container">
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
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="passwordConfirmation">Confirm Password:</label>
          <input type="password" id="passwordConfirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="form-button">Sign Up</button>
      </form>
    </div>
  );
};

export default RegisterPage; 