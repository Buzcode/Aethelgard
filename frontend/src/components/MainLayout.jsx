import {
  Link,
  Outlet,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import axiosClient from "../api/axiosClient"; // Important: Make sure this is correctly imported and configured

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownView, setDropdownView] = useState("main");
  const dropdownRef = useRef(null);

  // --- NEW SEARCH STATE AND REFS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null); // Ref for the search input element
  const searchContainerRef = useRef(null); // Ref for the whole search div (input + suggestions)

  // Logic to determine if sidebar should be shown
  const location = useLocation();
  const noSidebarRoutes = ["/login", "/register", "/admin"]; // Added /admin to routes without sidebar
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);

  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.first_name || "User";
    const lastName = user.last_name || "";
    const firstNameInitial = firstName[0] || "";
    const lastNameInitial = lastName ? lastName[0] || "" : firstName[1] || "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // Effect for handling clicks outside the profile dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setDropdownView("main");
  };

  // --- NEW SEARCH LOGIC ---

  // Function to fetch suggestions from the backend API
  // useCallback prevents this function from being re-created on every render
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      // Only search if query is at least 2 characters long
      setSearchResults([]);
      return;
    }
    try {
      const response = await axiosClient.get(`/search?q=${query}`);
      setSearchResults(response.data);
      setShowSuggestions(true); // Always show suggestions if there's data
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchResults([]);
    }
  }, []); // Empty dependency array means this function never changes

  // Debounce effect for the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce: waits 300ms after last keystroke before fetching

    return () => {
      clearTimeout(handler); // Clear timeout if searchTerm changes before 300ms
    };
  }, [searchTerm, fetchSuggestions]); // Rerun effect when searchTerm or fetchSuggestions changes

  // Handles changes in the search input field
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // showSuggestions will be handled by the useEffect debounce logic
  };

  // Handles clicking on a search suggestion
  const handleSuggestionClick = (item) => {
    // Navigate to the detail page using the item's type and id
    navigate(`/${item.type}/${item.id}`);
    setSearchTerm(""); // Clear the search term
    setSearchResults([]); // Clear the suggestions
    setShowSuggestions(false); // Hide the suggestions dropdown
    searchInputRef.current.blur(); // Remove focus from the search input
  };

  // Effect for handling clicks outside the search input/suggestions to hide suggestions
  useEffect(() => {
    function handleClickOutsideSearch(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);

  // Show suggestions when the search input gains focus (if there's a term and results)
  const handleSearchFocus = () => {
    if (searchTerm.length >= 2 && searchResults.length > 0) {
      setShowSuggestions(true);
    } else if (searchTerm.length < 2) {
      // If user focuses but term is too short, clear previous suggestions but don't show "No results"
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <header className="main-header">
        <div className="header-brand">
          <Link to="/">Aethelgard</Link>
        </div>

        {/* --- MODIFIED SEARCH BAR WITH SUGGESTIONS --- */}
        <div className="header-search" ref={searchContainerRef}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="SEARCH CHRONICLES..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus} // Show suggestions on focus
            // onBlur is deliberately not used directly here because it fires before handleSuggestionClick
            // The handleClickOutsideSearch useEffect handles hiding suggestions.
          />
          {showSuggestions &&
            (searchTerm.length >= 2 || searchResults.length > 0) && (
              <ul className="search-suggestions">
                {searchResults.length > 0
                  ? searchResults.map((item) => (
                      <li
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <span className="suggestion-title">{item.name}</span>
                        {/* Display category, replacing underscores with spaces and capitalizing */}
                        <span className="suggestion-category">
                          ({item.category.replace(/_/g, " ")})
                        </span>
                      </li>
                    ))
                  : // Display "No results found." only if there's a search term and no results
                    searchTerm.length >= 2 && <li>No results found.</li>}
              </ul>
            )}
        </div>

        <div className="header-right-nav">
          <nav className="main-nav">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/popular"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Most Popular
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Contact
            </NavLink>
          </nav>

          <div className="auth-section">
            {user ? (
              <div className="profile-container" ref={dropdownRef}>
                <div className="profile-icon" onClick={toggleDropdown}>
                  {getInitials()}
                </div>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    {dropdownView === "main" && (
                      <>
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          className="dropdown-item"
                          onClick={() => setDropdownView("info")}
                        >
                          Personal Information
                        </button>
                        <button
                          className="dropdown-item logout"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>
                      </>
                    )}
                    {dropdownView === "info" && (
                      <div className="dropdown-info">
                        <button
                          className="dropdown-back"
                          onClick={() => setDropdownView("main")}
                        >
                          &larr; Back
                        </button>
                        <div className="info-item">
                          <span>First Name</span>
                          <p>{user.first_name}</p>
                        </div>
                        <div className="info-item">
                          <span>Last Name</span>
                          <p>{user.last_name}</p>
                        </div>
                        <div className="info-item">
                          <span>Email</span>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="page-container">
        {shouldShowSidebar && <Sidebar />}

        <main
          className={
            shouldShowSidebar
              ? "main-content-area"
              : "main-content-area--full-width"
          }
        >
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </>
  );
};

export default MainLayout;
