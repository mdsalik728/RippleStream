import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import {
  GoogleGenAI,
} from '@google/genai'

// --- 1. API Client Initialization (Outside Component) ---
// NOTE: Assuming this file is saved as GeminiChatWidget.jsx or similar.
const key = import.meta.env.VITE_AI_API_KEY;
// Use the object syntax for robust initialization
const ai = new GoogleGenAI({ apiKey: key});


const historyCache = { prompt: [] }; 


async function getResponse(contents) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents, // Pass the entire array of messages
        });
        
        return response.text;
    } catch (error) {
        console.error("API Call Error:", error);
        throw new Error("Could not connect to Gemini API. Check key and network.");
    }
}

// --- 3. React Component ---

export default function GeminiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    // State stores messages for UI rendering
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Ref to access the mutable history cache inside the async function
    const historyRef = useRef(historyCache); 

    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        // 1. Prepare user message and optimistically update UI
        const currentPromptText = input + "(in brief)";
        const userMessage = { role: 'user', text: input }; // Message for UI state
        
        // Content object for API (uses the modified text)
        const newUserContent = {
            role: "user",
            parts: [{ text: currentPromptText }]
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 2. Build the full history array: past Content objects + new Content object
            const fullContents = [...historyRef.current.prompt, newUserContent];
            
            // 3. Get the response using the stateless helper
            let answer = await getResponse(fullContents);

            // 4. Update the persistent history cache
            historyRef.current.prompt.push(newUserContent);
            historyRef.current.prompt.push({
                role: "model",
                parts: [{ text: answer }]
            });

            // 5. Update UI state with model response
            const modelMessage = { role: 'model', text: answer };
            setMessages((prev) => [...prev, modelMessage]);

        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages((prev) => [...prev, { role: 'model', text: error.message || 'Error: API call failed.' }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]); // Dependency array for useCallback

    
    // --- 4. JSX for Collapsible Window ---
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
    // Calls the scrollIntoView method on the referenced DOM element
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
    if (isOpen && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
}, [messages, isOpen]);

    // Using Tailwind CSS classes for the collapsible and fixed positioning
    const widgetClasses = `md:fixed md:bottom-10 lg:right-4 z-50 transition-all duration-300 rounded-full ${
        isOpen ? 'w-96 h-[500px] shadow-2xl rounded-lg bg-green-700' : 'w-30 h-30 rounded-full '
    }`;
    const headerClasses = `flex justify-between items-center p-3 bg-green-700 text-white  cursor-pointer ${isOpen?'rounded-t-lg':'rounded-lg'}`;
    const chatWindowClasses = isOpen ? 'flex flex-col h-[calc(100%-48px)]' : 'hidden';

   return (
        <div className={widgetClasses}>
            {/* Header/Toggle Button */}
            <div className={headerClasses} onClick={() => setIsOpen(!isOpen)}>
                <h3 className="font-bold">{isOpen ? 'AI Assistant' : 'Ask AI 🤖'}</h3>
                <button className="text-xl">
                    {isOpen ? '—' : ''}
                </button>
            </div>

            {/* Chat Window Content */}
            <div className={chatWindowClasses}>
                {/* 3. Message Container: Added overflow-y-auto and scroll-auto for auto-scrolling */}
                <div className="flex-grow overflow-y-auto scroll-auto p-4 space-y-3">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-100 mt-2 text-sm">Hello! How can I help you today?</p>
                    )}
                    {messages.map((msg, index) => (
                        // 4. Message Bubbles: Use softer colors, full rounding, and text color for white background
                        <div 
                            key={index} 
                            className={`p-3 max-w-[85%] text-gray-800 break-words ${
                                msg.role === 'user' 
                                ? 'bg-gray-200 text-right ml-auto rounded-xl rounded-br-sm shadow-sm' 
                                : 'bg-gray-300 text-left mr-auto rounded-xl rounded-tl-sm shadow-sm'
                            }`}
                        >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))}
                    {/* Element to scroll into view */}
                    <div ref={messagesEndRef} /> 
                    {isLoading && <div className="p-2 text-center text-black-400 text-sm">AI is thinking...</div>}
                </div>
                
                {/* Input Field */}
                <div className="p-3 border-t border-gray-200">
                    <input
                        type="text"
                        // Input Styling: Light background, rounded
                        className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-500"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                    />
                    <button 
                        className="mt-2 w-full p-3 bg-green-800 text-white rounded-lg hover:bg-green-900 disabled:bg-green-700"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}