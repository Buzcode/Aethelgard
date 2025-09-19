import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // <-- 1. Import the useAuth hook

// --- Import Components ---
import GuestBanner from "../components/GuestBanner"; // <-- 2. Import your new banner component
import Recommendations from "../components/Recommendations";
import MostPopular from "../components/MostPopular";

// Image Imports
import leonardoDaVinciImg from "../assets/leonardo-da-vinci.jpg";
import eventsImg from "../assets/images/events.jpg";
import placesImg from "../assets/images/places.jpg";

const HomePage = () => {
  const { user } = useAuth(); // <-- 3. Get the current user's status
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

      {/* --- 4. CONDITIONAL BANNER LOGIC --- */}
      {/* This line checks: "Is there NO user?" If true, it renders the banner. */}
      {!user && <GuestBanner />}

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

      <section className="home-section">
        <h2>RECOMMENDATIONS</h2>
        <Recommendations />
      </section>

    </div>
  );
};

export default HomePage;