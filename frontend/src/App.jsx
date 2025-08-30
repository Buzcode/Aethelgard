import { Routes, Route } from 'react-router-dom';

// Import Layout and Page components
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import PeoplePage from './pages/PeoplePage';
import PlacesPage from './pages/PlacesPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage'; // <-- THIS IS THE FIX

function App() { 
  return ( 
    <Routes>
      {/* All pages using the MainLayout will be nested inside this Route */}
      <Route path="/" element={<MainLayout />}>
        
        {/* HomePage will be shown at the root "/" path */}
        <Route index element={<HomePage />} />
        
        {/* Your new dynamic route for categories */}
        <Route path="/:type/category/:categorySlug" element={<CategoryPage />} />
        
        {/* General pages for main types */}
        <Route path="figures" element={<PeoplePage />} />
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />

        {/* Other pages */}
        <Route path="login" element={<LoginPage />} /> 
        <Route path="register" element={<RegisterPage />} />
        <Route path="about" element={<AboutPage />} />    
        <Route path="contact" element={<ContactPage />} /> 

      </Route> 

      {/* This route is for the 404 page and does not use the MainLayout */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;