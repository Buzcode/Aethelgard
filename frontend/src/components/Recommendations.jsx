import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/recommendations');
                setRecommendations(response.data);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    // If loading, show placeholders
    if (loading) {
        return (
            <div className="recommendations-grid">
                {/* Render 5 placeholder cards */}
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="recommendation-card placeholder"></div>
                ))}
            </div>
        );
    }
    
    // If no recommendations, don't show the section
    if (recommendations.length === 0) {
        return null; 
    }

    return (
        <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
                <Link to={rec.link} key={index} className="recommendation-card">
                    <img src={rec.image_url} alt={rec.title} className="recommendation-image" />
                    <div className="recommendation-title-overlay">
                        <span className="recommendation-title">{rec.title}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Recommendations;