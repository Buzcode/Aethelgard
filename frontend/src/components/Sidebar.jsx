import React, { useState } from 'react';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    figures: true,
    events: true,
    places: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  return (
    <aside className="sidebar">
      {/* --- FIGURES SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('figures')}>
          FIGURES 
          <span className={`arrow ${openSections.figures ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.figures ? 'open' : 'closed'}>
          <li><a href="#">Politics & Leadership</a></li>
          <li><a href="#">Science & Technology</a></li>
          <li><a href="#">Arts & Culture</a></li>
          {/* "ETC." has been removed */}
        </ul>
      </div>

      {/* --- EVENTS SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('events')}>
          EVENTS
          <span className={`arrow ${openSections.events ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.events ? 'open' : 'closed'}>
          <li><a href="#">Conflicts & Warfare</a></li>
          <li><a href="#">Political & Social Transformations</a></li>
          <li><a href="#">Exploration & Discovery</a></li>
          {/* "ETC." has been removed */}
        </ul>
      </div>

      {/* --- PLACES SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('places')}>
          PLACES
          <span className={`arrow ${openSections.places ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.places ? 'open' : 'closed'}>
          <li><a href="#">Ancient Cities</a></li>
          <li><a href="#">Monuments & Structures</a></li>
          <li><a href="#">Lost Civilizations</a></li>
          {/* "ETC." has been removed */}
        </ul>
      </div>

      {/* --- SAVED and FAVOURITE TOPICS --- */}
      <div className="sidebar-section saved-items">
        <h3>SAVED</h3>
        <div className="saved-placeholder"></div>
      </div>

      <div className="sidebar-section favourite-topics">
        <h3>FAVOURITE TOPICS</h3>
        <div className="topic-placeholder"></div>
        <div className="topic-placeholder"></div>
        <div className="topic-placeholder"></div>
      </div>
    </aside>
  );
};

export default Sidebar;