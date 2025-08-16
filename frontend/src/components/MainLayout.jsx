import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const MainLayout = () => {
  // Get auth state and functions from context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the logout function from context
    logout();
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <div>
      <header>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <div>
            <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
            <Link to="/people" style={{ marginRight: '1rem' }}>People</Link>
            <Link to="/places" style={{ marginRight: '1rem' }}>Places</Link>
            <Link to="/events">Events</Link>
          </div>
          <div>
            {/* Conditionally render links based on user state */}
            {user ? (
              <>
                <span style={{ marginRight: '1rem' }}>Welcome, {user.name}!</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
             
              <>
                <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
                <Link to="/register">Register</Link>
              </>
           
            )}
          </div>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;