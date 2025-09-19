import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Chat from './Chat';
import GeminiIcon from './GeminiIcon';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginPromptVisible, setIsLoginPromptVisible] = useState(false);

    const handleIconClick = () => {
        if (user) {
            setIsOpen(!isOpen);
            setIsLoginPromptVisible(false);
        } else {
            setIsLoginPromptVisible(true);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    return (
        <div>
            {/* The main chatbox (no changes here) */}
            {isOpen && user && (
                <div className="chatbox">
                    <div className="chatbox-header">
                        <h3>AI Assistant</h3>
                        <button onClick={closeChat} className="chatbox-close-button">&times;</button>
                    </div>
                    <Chat />
                </div>
            )}

            {/* The Login Prompt */}
            {isLoginPromptVisible && !user && (
                <div className="chat-login-prompt">
                    <div className="prompt-box">
                        <h3>Unlock Living History</h3>
                        <p>Please log in or create an account to chat with our AI.</p>

                        {/* --- START: MODIFICATION --- */}
                        {/* We are replacing the single button with two separate links */}
                        <div className="prompt-actions">
                            <Link to="/login" className="prompt-login" onClick={() => setIsLoginPromptVisible(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="prompt-signup" onClick={() => setIsLoginPromptVisible(false)}>
                                Sign Up
                            </Link>
                        </div>
                        <button className="prompt-cancel" onClick={() => setIsLoginPromptVisible(false)}>
                            Maybe Later
                        </button>
                        {/* --- END: MODIFICATION --- */}

                    </div>
                </div>
            )}

            {/* The Floating Icon Button (no changes here) */}
            <button onClick={handleIconClick} className="chat-widget-button">
                <GeminiIcon />
            </button>
        </div>
    );
};

export default ChatWidget;