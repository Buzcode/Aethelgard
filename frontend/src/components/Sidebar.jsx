import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 


const Sidebar = ({ isOpen }) => {


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
  
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
    {/* === END OF MODIFICATION === */}

      {/* --- FIGURES SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('figures')}>
          FIGURES 
          <span className={`arrow ${openSections.figures ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.figures ? 'open' : 'closed'}>
          
          <li><Link to="/people/category/politics_leadership">Politics & Leadership</Link></li>
          <li><Link to="/people/category/science_technology">Science & Technology</Link></li>
          <li><Link to="/people/category/arts_culture">Arts & Culture</Link></li>
        </ul>
      </div>

      {/* --- EVENTS SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('events')}>
          EVENTS
          <span className={`arrow ${openSections.events ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.events ? 'open' : 'closed'}>
        
          <li><Link to="/events/category/conflicts_warfare">Conflicts & Warfare</Link></li>
          <li><Link to="/events/category/political_social_transformations">Political & Social Transformations</Link></li>
          <li><Link to="/events/category/exploration_discovery">Exploration & Discovery</Link></li>
        </ul>
      </div>

      {/* --- PLACES SECTION --- */}
      <div className="sidebar-section">
        <h3 onClick={() => toggleSection('places')}>
          PLACES
          <span className={`arrow ${openSections.places ? 'down' : 'right'}`}></span>
        </h3>
        <ul className={openSections.places ? 'open' : 'closed'}>
      
          <li><Link to="/places/category/ancient_cities">Ancient Cities</Link></li>
          <li><Link to="/places/category/monuments_structures">Monuments & Structures</Link></li>
          <li><Link to="/places/category/lost_civilizations">Lost Civilizations</Link></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;