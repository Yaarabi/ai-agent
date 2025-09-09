"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "@/components/messageBuble";
import ChatInput from "@/components/chatInput";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async (message) => {
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setIsTyping(true);

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "agent", content: data.output }]);
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100">
      <div className="flex flex-col w-full max-w-3xl h-[90vh] rounded-2xl shadow-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md">
        {/* Header */}
        <header className="p-5 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Yura Assistant
          </h1>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MessageBubble role={msg.role} content={msg.content} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800/70 rounded-xl w-fit"
              >
              <span className="text-xs text-gray-400 ml-2">typing</span>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur-md">
          <ChatInput onSend={handleSend} />
        </footer>
      </div>
    </div>
  );
}
