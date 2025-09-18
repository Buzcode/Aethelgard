import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const SavedArticlesPage = () => {
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedItems = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get('/saved-articles');
                setSavedItems(response.data);
            } catch (err) {
                console.error("Failed to fetch saved articles:", err);
                setError("Could not load your saved articles. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, []);

    if (loading) {
        return <div className="saved-articles-container"><h2>Loading your saved articles...</h2></div>;
    }

    if (error) {
        return <div className="saved-articles-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="saved-articles-container">
            <h1>Saved Articles</h1>
            {savedItems.length > 0 ? (
                <ul className="saved-list">
                    {savedItems.map(item => {
                        // --- START OF MODIFICATION ---
                        
                        // 1. Determine the correct path for the link.
                        const linkPath = item.article_type === 'people' 
                            ? `/figures/${item.article_id}` 
                            : `/${item.article_type}/${item.article_id}`;

                        // 2. Determine the correct display text for the badge.
                        const badgeText = item.article_type === 'people' 
                            ? 'Figures' 
                            : item.article_type;

                        // --- END OF MODIFICATION ---

                        return (
                            <li key={`${item.article_type}-${item.article_id}`} className="saved-item-card">
                                {/* Use the corrected linkPath variable */}
                                <Link to={linkPath} className="saved-item-link">
                                    <img 
                                        src={item.image_url} 
                                        alt={`Image of ${item.title}`} 
                                        className="saved-item-image"
                                    />
                                    <div className="saved-item-content">
                                        <h3>{item.title}</h3>
                                        {/* Use the corrected badgeText variable */}
                                        <span className="item-type-badge">{badgeText}</span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>You haven't saved any articles yet. Click the bookmark icon on any article to save it for later!</p>
            )}
        </div>
    );
};

export default SavedArticlesPage;