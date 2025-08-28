import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // We will need this soon

const Header = () => {
  const { user, logout } = useAuth(); // Get user state

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#e8e4d8' }}>
      <h1>AETHELGARD</h1>
      <div>Search Bar Placeholder</div>
      <nav>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        {/* We will add more links like "Most Popular" here later */}
        {user ? (
          <> 
            <span>Welcome, {user.name}!</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;