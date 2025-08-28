import React, {useState } from 'react';
import Chat from './Chat';
import GeminiIcon from './GeminiIcon'; 

const ChatWidget = () => {
    // State to manage whether the chatbox is open or closed
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the chatbox visibility
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* The Chatbox - Conditionally rendered based on the isOpen state */}
            {isOpen && (
                <div className="chatbox">
                    <div className="chatbox-header">
                        <h3>AI Assistant</h3>
                        <button onClick={toggleChat} className="chatbox-close-button">&times;</button>
                    </div>
                    {/* The actual chat component is nested inside */}
                    <Chat />
                </div>
            )}

            {/* The Floating Icon Button */}
            <button onClick={toggleChat} className="chat-widget-button">
                <GeminiIcon /> {/* <-- 2. USE THE NEW ICON COMPONENT HERE */}
            </button>
        </div>
    );
};

export default ChatWidget;