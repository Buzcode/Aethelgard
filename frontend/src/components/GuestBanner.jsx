import React from 'react';
import { Link } from 'react-router-dom';
// The styles for this component will be in index.css
import bannerImage from '../assets/The Library of Alexandria.png'; // <-- IMPORTANT: Make sure this path is correct for your image

const GuestBanner = () => {
  return (
    <div className="guest-banner">
      <img src={bannerImage} alt="A vast, ancient library" className="banner-image" />
      <div className="banner-overlay">
        <h1 className="banner-title">Your Gateway to the Past</h1>
        <p className="banner-subtitle">
          Explore interconnected histories and hold unforgettable conversations with our Living History AI.
        </p>
        <Link to="/register" className="banner-cta">
          Begin Your Journey
        </Link>
      </div>
    </div>
  );
};

export default GuestBanner;