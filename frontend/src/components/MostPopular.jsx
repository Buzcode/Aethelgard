// src/components/MostPopular.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import axiosClient from '../api/axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MostPopular = () => {
    const [popularItems, setPopularItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const scrollContainerRef = useRef(null);
    const [activePageIndex, setActivePageIndex] = useState(0);

    const itemsPerPage = 4;
    const totalPages = popularItems.length > 0 ? Math.ceil(popularItems.length / itemsPerPage) : 0;

    const linkPaths = {
        figure: 'figures',
        event: 'events',
        place: 'places'
    };

    useEffect(() => {
        const fetchPopularItems = async () => {
            try {
                const response = await axiosClient.get('/popular-items');
                setPopularItems(response.data);
            } catch (err) { 
                console.error('Failed to fetch popular items:', err);
                setError('Failed to fetch popular items.');
            } finally {
                setLoading(false);
            }
        };
        fetchPopularItems();
    }, []);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container || !container.children.length) return;
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.children[0].offsetWidth;
        const gap = 24;
        const firstVisibleCardIndex = Math.round(scrollLeft / (cardWidth + gap));
        const newPageIndex = Math.floor(firstVisibleCardIndex / itemsPerPage);
        setActivePageIndex(newPageIndex);
    };

    const handleDotClick = (pageIndex) => {
        const container = scrollContainerRef.current;
        if (!container || !container.children.length) return;
        const cardWidth = container.children[0].offsetWidth;
        const gap = 24;
        const targetCardIndex = pageIndex * itemsPerPage;
        container.scrollTo({
            left: targetCardIndex * (cardWidth + gap),
            behavior: 'smooth'
        });
    };

    if (loading) return <p>Loading most popular...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <section className="most-popular-section">
            <h2>MOST POPULAR</h2>
            <div className="carousel-wrapper">
                <div 
                    className="carousel-container" 
                    ref={scrollContainerRef} 
                    onScroll={handleScroll}
                >
                    {popularItems.map(item => (
                        <Link to={`/${linkPaths[item.type]}/${item.id}`} key={`${item.type}-${item.id}`} className="carousel-card">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="carousel-card-image"
                            />
                            <div className="carousel-card-name">
                                <span>{item.name.toUpperCase()}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="carousel-dots">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === activePageIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MostPopular;