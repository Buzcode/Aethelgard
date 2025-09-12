import React, { useState, useEffect, useRef } from 'react';
// frontend/src/components/MainLayout.jsx


import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import { useAuth } from '../hooks/useAuth';
import { HiMenu } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import './MainLayout.css';




const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState('main');
  const dropdownRef = useRef(null);

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
 
  // --- FIX #1: Changed 'background=random' to a specific, classic grey color ---
  const profilePicUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=6c757d&color=fff`;


  const toggleDropdown = () => {
    setDropdownView('main');
    setDropdownOpen(!isDropdownOpen);
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
    <div >
      <header className="main-header">
        {/* ... (header-left and main-nav are unchanged) ... */}
        <div className="header-left"><button className="menu-icon-btn"><HiMenu /></button><div className="header-brand"><Link to="/">Aethelgard</Link></div></div>
        <nav className="main-nav"><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink><NavLink to="/people" className={({ isActive }) => (isActive ? 'active-link' : '')}>People</NavLink><NavLink to="/places" className={({ isActive }) => (isActive ? 'active-link' : '')}>Places</NavLink><NavLink to="/events" className={({ isActive }) => (isActive ? 'active-link' : '')}>Events</NavLink><NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink><NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink></nav>


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
        <Sidebar />
        <main className="main-content-area">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </> 
  );
};
            <ChatWidget />
    </>
        <div className="auth-links">
          {user ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="profile-button">
                <img src={profilePicUrl} alt="Profile" className="profile-pic" />
                <div className="dropdown-arrow"><IoIosArrowDown size={12} /></div>
              </button>


              {isDropdownOpen && (
                <div className="dropdown-card-fb">
                  {dropdownView === 'main' ? (
                    <div>
                      <button
                        onClick={() => setDropdownView('details')}
                        className="dropdown-menu-item"
                      >
                        Personal Information
                      </button>
                      {/* --- FIX #2: Changed the className to 'logout-button-red' --- */}
                      <button
                        onClick={handleLogout}
                        className="logout-button-red"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setDropdownView('main')}
                        className="dropdown-back-button"
                      >
                        &larr; Back
                      </button>
                      <div className="info-box">
                          <label>First Name</label>
                          <span>{user.first_name || 'Not Available'}</span>
                      </div>
                      <div className="info-box">
                          <label>Last Name</label>
                          <span>{user.last_name || 'Not Available'}</span>
                      </div>
                      <div className="info-box">
                          <label>Email</label>
                          <span>{user.email || 'Not Available'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="login-links"><Link to="/login">Login</Link><Link to="/register">Sign Up</Link></div>
          )}
        </div>
      </header>




      <main className="main-content"><Outlet /></main>
    </div>
  );
};


export default MainLayout;