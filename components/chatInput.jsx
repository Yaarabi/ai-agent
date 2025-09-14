"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, isTyping }) {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-gray-800/70 border border-gray-700 rounded-full px-4 py-2 backdrop-blur-md shadow-lg"
        >
        <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <button
            disabled={isTyping || !input.trim()}
            type="submit"
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition shadow-md"
        >
            <Send size={18} />
        </button>
        </form>
    );
}
