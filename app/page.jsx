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
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="flex flex-col w-full max-w-3xl h-[92vh] rounded-2xl overflow-hidden">
        
        <header className="p-5 bg-gray-900/70 backdrop-blur-sm border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Yura Assistant
          </h1>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <MessageBubble role={msg.role} content={msg.content} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center  gap-2 px-4 py-1"
            >
              <span className="text-xs text-gray-400">typing</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-4">
          <ChatInput onSend={handleSend} isTyping = { isTyping } />
        </footer>
      </div>
    </div>
  );
}
