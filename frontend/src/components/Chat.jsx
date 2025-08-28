import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = () => {
    const [prompt, setPrompt] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        const userMessage = { role: 'user', content: prompt };
        
        // We create the full conversation history to send to the backend
        const conversationToSend = [...history, userMessage];
        
        setHistory(conversationToSend); // Update UI immediately
        setPrompt('');
        setIsLoading(true);

        try {
            const apiUrl = 'http://127.0.0.1:8000/api/chat';
            
            // *** THE IMPORTANT CHANGE ***
            // We now send the full conversation history every time
            const response = await axios.post(apiUrl, { history: conversationToSend });
            
            // The backend will now return the *complete* updated history
            setHistory(response.data.history);

        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = { role: 'model', content: 'Sorry, something went wrong. Please check the logs.' };
            setHistory(prevHistory => [...prevHistory, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="chat-history" ref={chatHistoryRef}>
                {history.map((msg, index) => (
                    <div key={index} className={`message-container ${msg.role}`}>
                        <div className={`message-bubble ${msg.role}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
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