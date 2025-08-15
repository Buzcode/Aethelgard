import { Routes, Route } from 'react-router-dom';

// Import Layout and Page components
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import PeoplePage from './pages/PeoplePage';
import PlacesPage from './pages/PlacesPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() { 
  return ( 
    <Routes>
      {/* All pages using the MainLayout will be nested inside this Route */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />
      </Route>

      {/* This route is for the 404 page and does not use the MainLayout */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;