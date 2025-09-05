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
import CategoryPage from "./pages/CategoryPage"; // <-- THIS IS THE FIX
import AdminDashboard from "./pages/AdminDashboard"; // Import your new AdminDashboard component
import AddArticlePage from "./pages/AddArticlePage"; // Placeholder for the Add Article page

function App() {
  return (
    <Routes>
      {/* All pages using the MainLayout will be nested inside this Route */}
      <Route path="/" element={<MainLayout />}>
        {/* HomePage will be shown at the root "/" path */}
        <Route index element={<HomePage />} />

        {/* Your new dynamic route for categories */}
        <Route
          path="/:type/category/:categorySlug"
          element={<CategoryPage />}
        />

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
      {/* Admin specific routes - these might not use MainLayout */}
      <Route path="/admin" element={<AdminDashboard />} />{" "}
      {/* Admin Dashboard Route */}
      <Route path="/admin/articles" element={<AdminDashboard />} />{" "}
      {/* Also points to dashboard for "All Articles" */}
      <Route
        path="/admin/categories"
        element={<div>Admin Categories Management (Coming Soon)</div>}
      />{" "}
      {/* Placeholder */}
      <Route path="/admin/add-article" element={<AddArticlePage />} />{" "}
      {/* Route for Add New Article page */}
      {/* This route is for the 404 page and does not use the MainLayout */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
