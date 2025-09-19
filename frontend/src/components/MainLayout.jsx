import { Link, Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import axiosClient from '../api/axiosClient';
import debounce from 'lodash.debounce';

// The reusable footer component (no changes here)
const Footer = () => {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Aethelgard. All rights reserved.</p>
      <div className="footer-links">
        <Link to="/about">About Us</Link> | 
        <Link to="/contact">Contact</Link> | 
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
    </footer>
  );
};


const MainLayout = () => {
  // --- State and Hooks Setup ---
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // This hook gives us the current URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Sidebar Logic for All Users (No changes here) ---
  const canShowSidebar = true; 

  // --- Component State (No changes here) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState('main');
  const dropdownRef = useRef(null);

  // --- Functions and Effects (No changes here) ---
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]); return;
    }
    try {
      const response = await axiosClient.get(`/suggestions?query=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    debouncedFetchSuggestions(searchTerm);
    return () => debouncedFetchSuggestions.cancel();
  }, [searchTerm, debouncedFetchSuggestions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSuggestions([]);
      navigate(`/search?query=${searchTerm.trim()}`);
    }
  };

  const handleArticleClick = (type, id) => {
    try {
      axiosClient.post('/track-click', { type, id });
    } catch (error)      {
      console.error("Failed to log click:", error);
    }
  };

  const handleSuggestionClick = () => {
    setSuggestions([]);
    setSearchTerm('');
  };

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
    navigate('/');
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
        <div className="header-brand-group">
          {canShowSidebar && (
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
          )}
          <div className="header-brand">
            <Link to="/">Aethelgard</Link>
          </div>
        </div>
        
        <div className="header-right-group">
          <div className="search-container">
            <form className="header-search" onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder="SEARCH HERE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  autoComplete="off"
                />
              </form>
              {suggestions.length > 0 && isFocused && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li key={`${suggestion.type}-${suggestion.id}`}>
                      <Link 
                        to={`/${suggestion.type}/${suggestion.id}`} 
                        onClick={() => {
                          handleArticleClick(suggestion.type, suggestion.id);
                          handleSuggestionClick();
                        }}
                      >
                        {suggestion.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </div>

          <div className="header-right-nav">
              <nav className="main-nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
                <NavLink to="/figures" className={({ isActive }) => (isActive ? 'active-link' : '')}>Figures</NavLink>
                <NavLink to="/places" className={({ isActive }) => (isActive ? 'active-link' : '')}>Places</NavLink>
                <NavLink to="/events" className={({ isActive }) => (isActive ? 'active-link' : '')}>Events</NavLink>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink>
              </nav>
              <div className="auth-section">
                {user ? (
                  <div className="profile-container" ref={dropdownRef} style={{ position: 'relative', zIndex: 20 }}>
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
                            
                            <Link
                              to="/saved-articles"
                              className="dropdown-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              Saved Articles
                            </Link>

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
                            <div className="info-item"><span>First Name</span><p>{user.first_name}</p></div>
                            <div className="info-item"><span>Last Name</span><p>{user.last_name}</p></div>
                            <div className="info-item"><span>Email</span><p>{user.email}</p></div>
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
        </div>
      </header>
      
      <div className="page-container">
        
        {isSidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {canShowSidebar && <Sidebar isOpen={isSidebarOpen} />}

        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
      <ChatWidget />

     
      {location.pathname === '/' && <Footer />}
    
    </> 
  );
};

export default MainLayout;