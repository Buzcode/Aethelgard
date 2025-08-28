import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState('main');
  const dropdownRef = useRef(null);

  const getInitials = () => {
    if (!user || !user.name) {
      return 'U'; // if name is not available
    }

    const nameParts = user.name.split(' ');

  
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    // the first letter of the first and last names
    const firstNameInitial = nameParts[0][0] || '';
    const lastNameInitial = nameParts[nameParts.length - 1][0] || '';

    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };


  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setDropdownView('main');
  };

  return (
    <>
      <header className="main-header">
        <div className="header-brand">
          <Link to="/">Aethelgard</Link>
        </div>
        
        <div className="header-search">
          <input type="text" placeholder="SEARCH HERE..." />
        </div>

        <div className="header-right-nav">
          <nav className="main-nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
            <NavLink to="/popular" className={({ isActive }) => (isActive ? 'active-link' : '')}>Most Popular</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink>
          </nav>

          <div className="auth-section">
            {user ? (
              <div className="profile-container" ref={dropdownRef}>
                {/* --- UPDATED LINE --- */}
                <div className="profile-icon" onClick={toggleDropdown}>
                  {getInitials()}
                </div>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    {dropdownView === 'main' && (
                      <>
                        <button className="dropdown-item" onClick={() => setDropdownView('info')}>
                          Personal Information
                        </button>
                        <button className="dropdown-item logout" onClick={handleLogout}>
                          Log Out
                        </button>
                      </>
                    )}

                    {dropdownView === 'info' && (
                      <div className="dropdown-info">
                        <button className="dropdown-back" onClick={() => setDropdownView('main')}>
                          &larr; Back
                        </button>
                        <div className="info-item">
                          <span>First Name</span>
                          {/* logic for "FirstName LastName" */}
                          <p>{user.name.split(' ')[0]}</p>
                        </div>
                        <div className="info-item">
                          <span>Last Name</span>
                          <p>{user.name.split(' ').slice(1).join(' ')}</p>
                        </div>
                        <div className="info-item">
                          <span>Email</span>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="page-container">
        <Sidebar />
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;