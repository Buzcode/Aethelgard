import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// This component is the core chat functionality
const Chat = () => {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
     
    // Create a ref for the chat history container
    const chatHistoryRef = useRef(null);

    // This effect will run every time the 'history' state changes
    useEffect(() => {
        // If the ref is attached to the element, scroll to the bottom
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]); // Dependency array ensures this runs only when history updates

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userMessage = { role: 'user', content: prompt };
        setHistory(prevHistory => [...prevHistory, userMessage]);
        setPrompt('');
        setIsLoading(true);

        try {
            const apiUrl = 'http://127.0.0.1:8000/api/chat';
            const response = await axios.post(apiUrl, { prompt: userMessage.content });
            const aiMessage = { role: 'model', content: response.data.reply };
            setHistory(prevHistory => [...prevHistory, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = { role: 'model', content: 'Sorry, something went wrong.' };
            setHistory(prevHistory => [...prevHistory, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Message History - ref is attached here */}
            <div className="chat-history" ref={chatHistoryRef}>
                {history.map((msg, index) => (
                    // Added a wrapper div to handle alignment
                    <div key={index} className={`message-container ${msg.role}`}>
                        <div className={`message-bubble ${msg.role}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </>
    );
};

export default Chat;