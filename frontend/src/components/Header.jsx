import { Link } from 'react-router-dom';

const HomePage = () => {
  // Reusable styles for this page
  const cardContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '2rem' };
  const cardStyle = { flex: 1, backgroundColor: '#e8e4d8', borderRadius: '8px', padding: '1rem', textAlign: 'center' };
  const cardImageStyle = { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' };
  const sectionStyle = { backgroundColor: '#e8e4d8', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' };

  return (
    <div>
      {/* Section 1: Featured Categories (Figures, Events, Places) */}
      <div style={cardContainerStyle}>
        <Link to="/people" style={{...cardStyle, textDecoration: 'none', color: 'inherit'}}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Francesco_Mazzola%2C_called_Parmigianino_-_Portrait_of_a_Man_-_WGA14830.jpg" alt="Historical Figure" style={cardImageStyle} />
          <p>FIGURES</p>
        </Link>
        <Link to="/events" style={{...cardStyle, textDecoration: 'none', color: 'inherit'}}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/The_Storming_of_the_Bastille%2C_14_July_1789.jpg/1280px-The_Storming_of_the_Bastille%2C_14_July_1789.jpg" alt="Historical Event" style={cardImageStyle} />
          <p>EVENTS</p>
        </Link>
        <Link to="/places" style={{...cardStyle, textDecoration: 'none', color: 'inherit'}}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg" alt="Historical Place" style={cardImageStyle} />
          <p>PLACES</p>
        </Link>
      </div>

      {/* Section 2: Most Popular */}
      <div style={sectionStyle}>
        <h2>MOST POPULAR</h2>
        {/* Placeholder content for the popular items carousel */}
        <p>Most popular content will be displayed here.</p>
      </div>
      
      {/* Section 3: Recommendations */}
      <div style={sectionStyle}>
        <h2>RECOMMENDATIONS</h2>
        {/* Placeholder content for recommendations */}
        <p>Recommendations will be displayed here.</p>
      </div>
    </div>
  );
};

export default HomePage;