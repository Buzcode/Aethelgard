// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- START: MODIFICATIONS ---
// 1. Import the Recommendations component (useAuth is no longer needed here)
import Recommendations from "../components/Recommendations";
// --- END: MODIFICATIONS ---

// Other Component Imports
import MostPopular from "../components/MostPopular";

// Image Imports
import leonardoDaVinciImg from "../assets/leonardo-da-vinci.jpg";
import eventsImg from "../assets/images/events.jpg";
import placesImg from "../assets/images/places.jpg";

const HomePage = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- START: MODIFICATIONS ---
  // 2. The useAuth hook has been removed as it's no longer necessary.
  // --- END: MODIFICATIONS ---

  useEffect(() => {
    // This fetch logic for trending topics remains unchanged.
    fetch("/api/trending-topics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrendingTopics(data);
      })
      .catch((error) => {
        console.error("Error fetching trending topics:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="homepage-container">
      <div className="card-gallery">
        {/* The top card gallery section remains unchanged. */}
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

        <div className="trending-topics-section">
          <h4>TRENDING TOPICS</h4>
          <ul>
            {isLoading ? (
              <li>Loading topics...</li>
            ) : trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <li key={`${topic.type}-${topic.id}`}>
                  <Link to={`/${topic.type}/${topic.id}`}>{topic.title}</Link>
                </li>
              ))
            ) : (
              <li>No trending topics right now.</li>
            )}
          </ul>
        </div>
      </div>

      <MostPopular />

      {/* --- START: MODIFICATIONS --- */}
      {/* 3. The conditional check has been removed. */}
      {/* This section will now appear for all users (guests and logged-in). */}
      <section className="home-section">
        <h2>RECOMMENDATIONS</h2>
        <Recommendations />
      </section>
      {/* --- END: MODIFICATIONS --- */}
    </div>
  );
};

export default HomePage;