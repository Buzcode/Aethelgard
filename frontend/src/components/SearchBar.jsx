// src/components/SearchBar.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // This function fetches suggestions from the '/api/suggestions' endpoint we created
  const fetchSuggestions = async (searchTerm) => {
    // Only search if the user has typed at least 2 characters
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axiosClient.get(`/suggestions?query=${searchTerm}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]); // Clear suggestions on error
    }
  };

  // This prevents the API from being called on every keystroke.
  // It waits 300ms after the user stops typing before sending the request.
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    debouncedFetchSuggestions(query);

    // Cleanup function to cancel any pending debounced calls when the component unmounts
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query, debouncedFetchSuggestions]);

  // This function runs when the user presses Enter or clicks a search button
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSuggestions([]); // Hide suggestions list
      navigate(`/search?query=${query}`); // Navigate to the results page
      setQuery(''); // Clear the search bar
    }
  };

  // This function runs when a user clicks on a suggestion link
  const handleSuggestionClick = () => {
    setSuggestions([]); // Hide suggestions list
    setQuery(''); // Clear the search bar
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)} // Show suggestions when input is focused
          // A small delay on blur allows the click on a suggestion to register first
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for articles..."
          className="search-input"
          autoComplete="off"
        />
      </form>

      {/* --- This is the Suggestions Dropdown --- */}
      {suggestions.length > 0 && isFocused && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li key={`${suggestion.type}-${suggestion.id}`}>
              <Link 
                to={`/${suggestion.type}/${suggestion.id}`} 
                onClick={handleSuggestionClick}
              >
                {suggestion.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;