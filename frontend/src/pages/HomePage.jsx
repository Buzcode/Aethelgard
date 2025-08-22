import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // We will replace the styles in the next step

// Import the images
import peopleImage from '../assets/images/people.jpg';
import eventsImage from '../assets/images/events.jpg';
import placesImage from '../assets/images/places.jpg';

const HomePage = () => {
  return (
    // The main container that will control the full-screen layout
    <main className="fullscreen-container">

      {/* --- Top Row: Dynamic Picture Cards --- */}
      <section className="home-row card-gallery">
        <Link to="/people" className="card">
          <img src={peopleImage} alt="Historical Figures" />
          <div className="card-label">PEOPLE</div>
        </Link>
        <Link to="/events" className="card">
          <img src={eventsImage} alt="Historical Events" />
          <div className="card-label">EVENTS</div>
        </Link>
        <Link to="/places" className="card">
          <img src={placesImage} alt="Historical Places" />
          <div className="card-label">PLACES</div>
        </Link>
      </section>

      {/* --- Middle Row: Most Popular --- */}
      <section className="home-row most-popular">
        <h2>MOST POPULAR</h2>
        <div className="items-container">
          <div className="popular-item">
            <img src={peopleImage} alt="Leonardo da Vinci" />
            <span>LEONARDO DA...</span>
          </div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
        </div>
      </section>

      {/* --- Bottom Row: Recommendations --- */}
      <section className="home-row recommendations">
        <h2>RECOMMENDATIONS</h2>
        <div className="items-container">
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
          <div className="placeholder-item"></div>
        </div>
      </section>

    </main>
  );
};

export default HomePage;