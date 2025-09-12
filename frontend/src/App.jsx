// src/App.jsx

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

function App() {
  return (
    <Routes>
      {/* --- ROUTES WITHOUT SIDEBAR --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- ROUTES WITH SIDEBAR (using MainLayout) --- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/:type/category/:categorySlug" element={<CategoryPage />} />
        <Route path="figures" element={<PeoplePage />} />
        <Route path="places" element={<PlacesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* --- ADMIN PROTECTED ROUTES --- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/articles" element={<AdminDashboard />} />
        <Route path="/admin/add-article" element={<AddArticlePage />} />
        <Route
          path="/admin/categories"
          element={<div>Admin Categories Management (Coming Soon)</div>}
        />
      </Route>

      {/* Catch-all 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;