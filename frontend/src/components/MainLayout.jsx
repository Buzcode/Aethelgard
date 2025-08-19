import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { HiMenu } from 'react-icons/hi'; // Icon import

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
  <header className="main-header">
  <div className="header-left">
    <button className="menu-icon-btn">
      <HiMenu />
    </button>
    <div className="header-brand">
      <Link to="/">Aethelgard</Link>
    </div>
  </div>
  
  <nav className="main-nav">
  <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
  <NavLink to="/people" className={({ isActive }) => (isActive ? 'active-link' : '')}>People</NavLink>
  <NavLink to="/places" className={({ isActive }) => (isActive ? 'active-link' : '')}>Places</NavLink>
  <NavLink to="/events" className={({ isActive }) => (isActive ? 'active-link' : '')}>Events</NavLink>
  <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink>
  <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink>
</nav>

  <div className="auth-links">
    {user ? (
      <>
        <span>Welcome, {user.name}!</span>
        <button onClick={handleLogout}>Logout</button>
      </>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
      </>
    )}
  </div>
</header>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;