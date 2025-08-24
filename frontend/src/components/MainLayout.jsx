// frontend/src/components/MainLayout.jsx


import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
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


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout();
    //setDropdownOpen(false);
    navigate('/login');
  };
 
  // --- FIX #1: Changed 'background=random' to a specific, classic grey color ---
  const profilePicUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=6c757d&color=fff`;


  const toggleDropdown = () => {
    setDropdownView('main');
    setDropdownOpen(!isDropdownOpen);
  };


  return (
    <div >
      <header className="main-header">
        {/* ... (header-left and main-nav are unchanged) ... */}
        <div className="header-left"><button className="menu-icon-btn"><HiMenu /></button><div className="header-brand"><Link to="/">Aethelgard</Link></div></div>
        <nav className="main-nav"><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink><NavLink to="/people" className={({ isActive }) => (isActive ? 'active-link' : '')}>People</NavLink><NavLink to="/places" className={({ isActive }) => (isActive ? 'active-link' : '')}>Places</NavLink><NavLink to="/events" className={({ isActive }) => (isActive ? 'active-link' : '')}>Events</NavLink><NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : '')}>About Us</NavLink><NavLink to="/contact" className={({ isActive }) => (isActive ? 'active-link' : '')}>Contact</NavLink></nav>


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