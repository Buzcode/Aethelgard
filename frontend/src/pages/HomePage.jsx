import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// --- Import Components ---
import GuestBanner from "../components/GuestBanner";
import Recommendations from "../components/Recommendations";
import MostPopular from "../components/MostPopular";

// Image Imports
import leonardoDaVinciImg from "../assets/leonardo-da-vinci.png";
import eventsImg from "../assets/images/events.png";
import placesImg from "../assets/images/places.png";

const HomePage = () => {
  const { user } = useAuth();
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This fetch logic remains unchanged
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
    // Use a React Fragment as the new root element
    <>
      {/* Banner Section: Renders outside the main container to be full-width */}
      {!user && <GuestBanner />}

      {/* This new container will keep the main content centered */}
      <div className="content-container">
          <h2 className="explore-today-title">What do you want to explore today?</h2>

        <div className="card-gallery">
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
      </div>

      {/* Most Popular Section: Full-width wrapper with a centered container inside */}
      <div className="full-width-wrapper">
        <div className="content-container">
          <MostPopular />
        </div>
      </div>

      {/* Recommendations Section: Full-width wrapper with a centered container inside */}
     {/* Recommendations Section: Now in a self-contained box */}
<div className="recommendations-section-box">
  <h2 className="section-title">RECOMMENDATIONS</h2>
  <Recommendations />
</div>
    </>
  );
};

export default HomePage;