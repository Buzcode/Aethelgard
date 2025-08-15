import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <header>
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <Link to="/">Home</Link>
          <Link to="/people">People</Link>
          <Link to="/places">Places</Link>
          <Link to="/events">Events</Link>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        {/* The Outlet component renders the content of the current page route */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;