import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';

const Recommendations = () => {
    const { user } = useAuth(); // We already have the user state here
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = useCallback(async () => {
        // Only fetch recommendations if the user is logged in
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axiosClient.get(`/recommendations?_=${new Date().getTime()}`);
            setRecommendations(response.data);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    }, [user]); // <-- Add user as a dependency

    useEffect(() => {
        fetchRecommendations();
        window.addEventListener('recommendations-changed', fetchRecommendations);
        return () => {
            window.removeEventListener('recommendations-changed', fetchRecommendations);
        };
    }, [fetchRecommendations]);

    // --- NEW LOGIC STARTS HERE ---

    // 1. If there is NO user, show the login prompt.
    if (!user) {
        return (
            <div className="recommendations-empty-message">
                <p>Log in or create an account to get personalized recommendations!</p>
            </div>
        );
    }

    // 2. If a user IS logged in, continue with the original logic...
    // Show loading placeholders while fetching
    if (loading) {
        return (
            <div className="recommendations-grid">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="recommendation-card placeholder"></div>
                ))}
            </div>
        );
    }
    
    // If the logged-in user has no recommendations yet, show a helpful message.
    if (recommendations.length === 0) {
        return (
            <div className="recommendations-empty-message">
                <p>Like some articles to see personalized recommendations here!</p>
            </div>
        );
    }

    // Finally, if the user is logged in and has recommendations, show them.
    return (
        <div className="recommendations-grid">
            {recommendations.map((rec) => (
                <Link to={rec.link} key={rec.link} className="recommendation-card">
                    <img 
                        src={rec.image_url || '/path/to/default-image.png'}
                        alt={rec.title} 
                        className="recommendation-image" 
                    />
                    <div className="recommendation-title-overlay">
                        <span className="recommendation-title">{rec.title}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Recommendations;