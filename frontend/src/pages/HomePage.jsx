import React from "react";
import { Link } from "react-router-dom";

import leonardoDaVinciImg from "../assets/leonardo-da-vinci.jpg";
import eventsImg from "../assets/images/events.jpg";
import placesImg from "../assets/images/places.jpg";

const HomePage = () => {
  return (
    <div className="homepage-container">
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
      </div>

      {/* ============== MOST POPULAR SECTION ============== */}
      <section className="home-section">
        <h2>MOST POPULAR</h2>
        <div className="items-container">
          <div className="item-card">
            <img src={leonardoDaVinciImg} alt="Leonardo Da Vinci" />
            <span>LEONARDO DA VINCI</span>
          </div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
          <div className="item-placeholder"></div>
        </div>
      </section>

      {/* ============== RECOMMENDATIONS SECTION ============== */}
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
