// src/pages/DetailPage.jsx (NEW FILE)

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const DetailPage = () => {
    const { id } = useParams(); // Gets the 'id' from the URL, e.g., "4"
    const location = useLocation(); // Gets the full URL information
    
    // Determine the type ('people', 'places', 'events') from the URL path
    const type = location.pathname.split('/')[1]; 

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!type || !id) {
            setError("Could not determine article type or ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        // Fetch the specific item using the type and id
        axiosClient.get(`/${type}/${id}`)
            .then(({ data }) => {
                setItem(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(`Failed to fetch ${type}:`, err);
                setError("Could not load the article. It may not exist.");
                setLoading(false);
            });

    }, [type, id]); // Rerun the effect if the type or id changes

    if (loading) return <div>Loading article...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    if (!item) return <div>Article not found.</div>;
    
    // Construct the full image URL
    const imageUrl = `http://127.0.0.1:8000/storage/${item.picture || item.portrait_url}`;
    
    // Use 'bio' for people and 'description' for others
    const description = item.bio || item.description;

    return (
        <div className="detail-page-container" style={{ padding: '40px' }}>
            <h1>{item.name}</h1>
            <img src={imageUrl} alt={item.name} style={{ maxWidth: '600px', height: 'auto', margin: '20px 0' }} />
            <div className="item-meta" style={{ color: '#555', marginBottom: '20px' }}>
                <p><strong>Category:</strong> {item.category.replace('_', ' ')}</p>
                {/* You can add other meta info here like dates if they exist */}
                {item.event_date && <p><strong>Date:</strong> {item.event_date}</p>}
                {item.birth_date && <p><strong>Born:</strong> {item.birth_date}</p>}
                {item.death_date && <p><strong>Died:</strong> {item.death_date}</p>}
            </div>
            <div className="item-description" style={{ lineHeight: '1.6' }}>
                {/* Use dangerouslySetInnerHTML if description contains HTML, otherwise just use <p> */}
                <p>{description}</p>
            </div>
        </div>
    );
};

export default DetailPage;