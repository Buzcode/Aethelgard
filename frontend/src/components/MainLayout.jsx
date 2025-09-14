import { Link, Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState('main');
  const dropdownRef = useRef(null);
  
  // MODIFICATION 2: Added logic to check the current route
  const location = useLocation();
  const noSidebarRoutes = ['/login', '/register'];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || 'User';
    const lastName = user.last_name || '';

    const firstNameInitial = firstName[0] || '';
    const lastNameInitial = lastName ? (lastName[0] || '') : (firstName[1] || '');

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
                <div className="profile-icon" onClick={toggleDropdown}>
                  {getInitials()}
                </div>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    {dropdownView === 'main' && (
                      <>
                        {user.role === 'admin' && (
                           <Link 
                              to="/admin" 
                              className="dropdown-item"
                              onClick={() => setDropdownOpen(false)}
                           >
                              Admin Dashboard
                           </Link>
                        )}
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
                          <p>{user.first_name}</p>
                        </div>
                        <div className="info-item">
                          <span>Last Name</span>
                          <p>{user.last_name}</p>
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
        {shouldShowSidebar && <Sidebar />}
        
        <main className={shouldShowSidebar ? "main-content-area" : "main-content-area--full-width"}>
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </> 
  );
};

export default MainLayout;