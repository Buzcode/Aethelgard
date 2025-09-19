import React from 'react';
import about1 from '../assets/about1.jpg'; // Only about1 is needed

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <h1 className="about-heading">About Us</h1>

      <div className="quote-section">
        <p className="quote-mlk">
          "We are not makers of history. We are made by history."
          <br />
          --Martin Luther King Jr.
        </p>
        <p className="quote-obama">
          "The study of history is not about memorizing dates and names. It's about understanding the forces that shape our world."
          <br />
          --Barack Obama
        </p>
      </div>

      {/* Single image section */}
      <div className="single-image-section">
        <img src={about1} alt="Historical Event" className="main-about-image" />
        <p className="image-caption-single">Mughal Empire</p> {/* Example caption */}
        <div className="horizontal-line"></div> {/* Straight line after image */}
      </div>

      {/* MISSION SECTION */}
      <div className="section-mission-vision-goal">
        <div className="content-wrapper">
          <h2 className="section-title-new">Our Mission</h2> {/* No icon */}
          <p className="section-paragraph">
            To make history engaging and accessible by sharing the stories of people, places, and events that shaped the world. We aim to connect the past with the present so everyone can learn, reflect, and be inspired.
          </p>
        </div>
      </div>

      {/* VISION SECTION */}
      <div className="section-mission-vision-goal">
        <div className="content-wrapper">
          <h2 className="section-title-new">Our Vision</h2> {/* No icon */}
          <p className="section-paragraph">
            A world where history is not forgotten but celebrated—where people of all ages can explore the past to better understand their identity, culture, and future.
          </p>
        </div>
      </div>

      {/* GOAL SECTION */}
      <div className="section-mission-vision-goal no-border"> {/* Added no-border class */}
        <div className="content-wrapper">
          <h2 className="section-title-new">Our Goal</h2> {/* No icon */}
          <p className="section-paragraph">
            To build a rich, reliable, and user-friendly platform that preserves historical knowledge and presents it in a way that sparks curiosity, encourages learning, and keeps the legacy of history alive for future generations.
          </p>
        </div>
      </div>

      <div className="closing-statement-new">
        <p>We invite you to explore, learn, and Journey through time with us. Every person, every place, and every event has a story to tell—and we're here to keep those stories alive. Together, let’s discover the lessons of yesterday, to better understand today, and to inspire tomorrow.</p>
        {/* If you still want a sparkle icon, make sure its path is correct */}
        {/* <span className="sparkle-icon">
            <img src="/path/to/sparkle_icon.png" alt="Sparkle" />
        </span> */}
      </div>
    </div>
  );
};

export default AboutPage;