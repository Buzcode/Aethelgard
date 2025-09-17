// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Component Imports
import MostPopular from "../components/MostPopular"; 

// Image Imports
import leonardoDaVinciImg from "../assets/leonardo-da-vinci.jpg";
import eventsImg from "../assets/images/events.jpg";
import placesImg from "../assets/images/places.jpg";

const HomePage = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // <-- 1. ADD a loading state

  useEffect(() => {
    fetch("/api/trending-topics")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTrendingTopics(data);
      })
      .catch(error => {
        console.error("Error fetching trending topics:", error);
      })
      .finally(() => {
        setIsLoading(false); // <-- 2. SET loading to false after fetch completes (success or fail)
      });
  }, []);

  return (
    <div className="homepage-container">
      <div className="card-gallery">
        {/* ... other cards (Figures, Events, Places) remain the same ... */}
        <Link to="/figures" className="category-card figures-card">
          <img src={leonardoDaVinciImg} alt="Historical Figures" />
          <div className="card-label">FIGURES</div>
        </Link>
        <Link to="/events" className="category-card">
          <img src={eventsImg} alt="Historical Events" />
          <div className="card-label">EVENTS</div>
        </Link>
        <Link to="/places" className="category-card">
          <img src={placesImg} alt="Historical Places" />
          <div className="card-label">PLACES</div>
        </Link>

        {/* Card 4: Trending Topics */}
        <div className="trending-topics-section">
          <h4>TRENDING TOPICS</h4>
          <ul>
            {/* --- 3. UPDATE the display logic --- */}
            {isLoading ? (
              <li>Loading topics...</li>
            ) : trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <li key={`${topic.type}-${topic.id}`}>
                  <Link to={`/${topic.type}/${topic.id}`}>{topic.title}</Link>
                </li>
              ))
            ) : (
              <li>No trending topics right now.</li> // <-- This is your new message
            )}
          </ul>
        </div>
      </div>

      <MostPopular />

      {/* ============== RECOMMENDATIONS SECTION ============== */}
      {/* ... this section remains the same ... */}
      <section className="home-section">
        <h2>RECOMMENDATIONS</h2>
        <div className="items-container">
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;