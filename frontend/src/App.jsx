import { Routes, Route } from "react-router-dom";

// Import Layout and Page components
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

import DetailPage from "./pages/DetailPage"; 

import SearchResultsPage from "./pages/SearchResultsPage";

import PersonalInformationPage from "./pages/PersonalInformationPage"; 

import SavedArticlesPage from './pages/SavedArticlesPage';

// --- THIS IS THE FIX ---
// You need to import the ProtectedRoute component before you can use it.
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
         <Route path="personal-information" element={<PersonalInformationPage />} />
         <Route path="/search" element={<SearchResultsPage />} />
         {/* This line will now work correctly */}
         <Route path="/saved-articles" element={<ProtectedRoute><SavedArticlesPage /></ProtectedRoute>} /> 
        <Route path="/:type/category/:categorySlug" element={<CategoryPage />} />
        
        {/* Routes for listing all items */}
        <Route path="figures" element={<PeoplePage />} />
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />

        {/* --- ADD THESE 3 NEW ROUTES FOR DETAIL PAGES --- */}
        <Route path="people/:id" element={<DetailPage />} />
        <Route path="places/:id" element={<DetailPage />} />
        <Route path="events/:id" element={<DetailPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* --- ADMIN PROTECTED ROUTES --- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-article" element={<AddArticlePage />} />
        <Route path="/admin/edit/:type/:id" element={<AddArticlePage />} />
      </Route>

      {/* Catch-all 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;