"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "@/components/messageBuble";
import ChatInput from "@/components/chatInput";
import { useStore } from "../zustand/store";
import InstagramCalendar from "@/components/instaCalendar";
import ReportCard from "@/components/report";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [openReport, setOpenReport] = useState(false);
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

    if (data.action) {
      if (data.action === "Calendar opened") {
        useStore.getState().setOpenCalender();
        setOpenReport(false);
      } else if (data.action === "Calendar closed") {
        useStore.getState().setCloseCalender();
      } else if (data.action === "Report shown") {
      setOpenReport(true);
      useStore.getState().setCloseCalender();
      } else if (data.action === "Report hidden") {
        setOpenReport(false);
      }
  }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openCalender = useStore((state) => state.openCalender);

  return (
    <div className="h-screen w-full flex justify-evenly items-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 px-4">
      <div className="flex flex-col w-full max-w-[45vw] h-[92vh] rounded-2xl overflow-hidden shadow-2xl border border-gray-800/40">
        
        <header className="p-5 bg-gray-900/70 backdrop-blur-md border-b border-gray-800">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Yura Assistant
          </h1>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <MessageBubble role={msg.role} content={msg.content} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-1"
            >
              <span className="text-xs text-gray-400">Compiling</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-4 bg-gray-900/60 backdrop-blur-md border-t border-gray-800">
          <ChatInput onSend={handleSend} isTyping={isTyping} />
        </footer>
      </div>

      {/* Calendar */}
      {openCalender && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="hidden lg:block ml-6"
        >
          <InstagramCalendar />
        </motion.div>
      )}
      {/* Report */}
      {openReport && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
          className="hidden lg:block ml-6"
        >
          <ReportCard/>
        </motion.div>
      )}
    </div>
  );
}
