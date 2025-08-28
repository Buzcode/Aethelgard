import React from 'react';

const GeminiIcon = () => (
    // The container div with the perfect drop-shadow
    <div style={{ position: 'relative', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))' }}>
        {/* We define the gradient once and reuse it for both stars */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
                <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8E44AD' }} />
                    <stop offset="100%" style={{ stopColor: '#3498DB' }} />
                </linearGradient>
            </defs> 
        </svg>

        {/* The LARGE star with the correct path data */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="56" 
            height="56"
            fill="url(#gemini-gradient)"
        >
            {/* THIS IS THE REAL, PIXEL-PERFECT PATH DATA */}
            <path d="M12 0C11.17 6.33 6.33 11.17 0 12C6.33 12.83 11.17 17.67 12 24C12.83 17.67 17.67 12.83 24 12C17.67 11.17 12.83 6.33 12 0Z" />
        </svg>
        
        {/* The SMALL star, positioned absolutely, also with the correct path */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24"
            fill="url(#gemini-gradient)"
            style={{ position: 'absolute', top: '-5px', right: '-15px' }}
        >
            <path d="M12 0C11.17 6.33 6.33 11.17 0 12C6.33 12.83 11.17 17.67 12 24C12.83 17.67 17.67 12.83 24 12C17.67 11.17 12.83 6.33 12 0Z" />
        </svg>
    </div>
);

export default GeminiIcon;