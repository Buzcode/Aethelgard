import { Routes, Route } from 'react-router-dom';

// Import Layout and Page components
<<<<<<< Updated upstream
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
=======
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import PeoplePage from "./pages/PeoplePage";
import PlacesPage from "./pages/PlacesPage";
import EventsPage from "./pages/EventsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import AddArticlePage from "./pages/AddArticlePage";
import AdminRoute from "./components/AdminRoute";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

function App() { 
  return ( 
    <Routes>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      {/* All pages using the MainLayout will be nested inside this Route */}
=======
=======
>>>>>>> Stashed changes
      {/* --- ROUTES WITHOUT SIDEBAR --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- ROUTES WITH SIDEBAR (using MainLayout) --- */}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <Route path="/" element={<MainLayout />}>
        
        {/* HomePage will be shown at the root "/" path */}
        <Route index element={<HomePage />} />
        
        {/* --- THIS IS THE LINE TO FIX --- */}
        {/* Changed path from "people" to "figures" to match your link */}
        <Route path="figures" element={<PeoplePage />} />
        
        {/* These routes are correct based on your homepage links */}
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />
<<<<<<< Updated upstream
<<<<<<< Updated upstream

        {/* Other pages */}
        <Route path="login" element={<LoginPage />} /> 
        <Route path="register" element={<RegisterPage />} />
        <Route path="about" element={<AboutPage />} />    
        <Route path="contact" element={<ContactPage />} /> 
=======
=======
>>>>>>> Stashed changes
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
>>>>>>> Stashed changes

        {/* The <Chat/> route was removed because the ChatWidget is already in MainLayout */}
      </Route> 

      {/* This route is for the 404 page and does not use the MainLayout */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;