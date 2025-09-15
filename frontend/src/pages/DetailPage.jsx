
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

import { BsHeart, BsHeartFill, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailPage = () => {

    const { id } = useParams(); // Gets the 'id' from the URL
    const location = useLocation(); // Gets the full URL information
    
    // Determine the type ('people', 'places', 'events') from the URL path
    const type = location.pathname.split('/')[1]; 

    const { id } = useParams();
    const location = useLocation();
    const type = location.pathname.split('/')[1];
    const { user } = useAuth();


    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // This function is now structured EXACTLY like your working EventsPage
        const fetchItem = async () => {
            if (!type || !id) {
                setError("Could not determine article type or ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data } = await axiosClient.get(`/${type}/${id}`);

                // Your proven data sanitization logic
                const sanitizedData = {
                    ...data,
                    is_liked: data.is_liked || false,
                    is_saved: data.is_saved || false,
                };
                setItem(sanitizedData);
                setError(null); // Clear previous errors on success
            } catch (err) {
                console.error(`Failed to fetch ${type}:`, err);
                setError("Could not load the article. It may not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [type, id, user]); // The dependencies are correct

    const handleLike = async () => {
        if (!user) {
            alert("Please log in to like posts.");
            return;
        }
        if (isSubmitting || !item) return;
        setIsSubmitting(true);
        const originalItem = { ...item };
        setItem({ ...item, likes: item.is_liked ? item.likes - 1 : item.likes + 1, is_liked: !item.is_liked });
        try {
            await axiosClient.post(`/${type}/${item.id}/like`);
        } catch (error) {
            console.error("Failed to update like status:", error);
            setItem(originalItem);
            alert("Could not update like status. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Loading article...</div>;
    if (error) return <div className="detail-page-container">{error}</div>;
    if (!item) return <div className="detail-page-container">Article not found.</div>;

    const imageUrl = `${API_BASE_URL}${item.image_path || `/storage/${item.picture || item.portrait_url}`}`;
    const description = item.bio || item.description;

    return (
        <div className="detail-page-container">
            <h1 className="detail-title">{item.name}</h1>
            <div className="image-container">
                <img src={imageUrl} alt={item.name} className="detail-image" />
                <div className="detail-actions">
                    <button onClick={handleLike} disabled={isSubmitting} className={`action-button ${item.is_liked ? 'liked' : ''}`}>
                        <span className="icon">
                            {item.is_liked ? <BsHeartFill /> : <BsHeart />}
                        </span>
                        <span className="count">{item.likes}</span>
                    </button>
                    <button disabled={isSubmitting} className={`action-button ${item.is_saved ? 'saved' : ''}`}>
                        <span className="icon">
                            {item.is_saved ? <BsBookmarkFill /> : <BsBookmark />}
                        </span>
                    </button>
                </div>
            </div>
            <div className="item-meta">
                <p><strong>Category:</strong> {item.category.replace('_', ' ')}</p>

                {item.event_date && <p><strong>Date:</strong> {item.event_date}</p>}
                {item.birth_date && <p><strong>Born:</strong> {item.birth_date}</p>}
                {item.death_date && <p><strong>Died:</strong> {item.death_date}</p>}
            </div>
            <p className="item-description">{description}</p>
        </div>
    );
};

export default DetailPage;