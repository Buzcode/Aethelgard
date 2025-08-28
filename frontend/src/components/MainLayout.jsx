import React from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiMenu } from 'react-icons/hi';
import ChatWidget from './ChatWidget'; // The widget is now imported

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="main-header">
        <div className="header-left">
          <button className="menu-icon-btn">
            <HiMenu size={24} />
          </button>
          <div className="header-brand">
            <Link to="/">Aethelgard</Link>
          </div>
        </div>
        
        <div className="header-right">
          <nav className="main-nav">
            {/* The className prop on NavLink correctly toggles the 'active-link' class */}
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
                {/* Re-using your form-button style for consistency */}
                <button onClick={handleLogout} className="form-button" style={{width: 'auto', padding: '0.5rem 1rem', marginLeft: '1.5rem'}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>

      {/* The Chat Widget is now part of the layout and will be styled by index.css */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;