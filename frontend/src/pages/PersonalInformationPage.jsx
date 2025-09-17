// src/pages/PersonalInformationPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const PersonalInformationPage = () => {
  const { user } = useAuth();

  // If for any reason the user is not logged in, redirect them.
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="personal-info-page-container">
      <h1>Personal Information</h1>
      <div className="personal-info-card">
        {/* You can add a back button for better user experience */}
        <Link to="/" className="back-link">&larr; Back to Home</Link>
        
        <div className="info-item">
          <span>First Name</span>
          <p>{user.first_name || 'Not Provided'}</p>
        </div>
        <div className="info-item">
          <span>Last Name</span>
          <p>{user.last_name || 'Not Provided'}</p>
        </div>
        <div className="info-item">
          <span>Email</span>
          <p>{user.email}</p>
        </div>
        <div className="info-item">
          <span>Role</span>
          <p style={{ textTransform: 'capitalize' }}>{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationPage;