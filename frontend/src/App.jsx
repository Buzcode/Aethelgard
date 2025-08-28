import { Routes, Route } from 'react-router-dom';

// Import Layout and Page components
import MainLayout from './components/MainLayout';
import Chat from './components/Chat'; 
import HomePage from './pages/HomePage';
import PeoplePage from './pages/PeoplePage';
import PlacesPage from './pages/PlacesPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

 
function App() { 
  return ( 
    <Routes>
      {/* All pages using the MainLayout will be nested inside this Route */}
      <Route path="/" element={<MainLayout />}>
      <Route path="/" element={<Chat/>}></Route>
        <Route index element={<HomePage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />
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
