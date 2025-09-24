"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageBubble from "@/components/messageBuble";
import ChatInput from "@/components/chatInput";
import { useStore } from "../zustand/store";
import InstagramCalendar from "@/components/instaCalendar";
import ReportCard from "@/components/report";
import { Chart } from "@/components/charts";
import {
  TableView,
  CodeView,
  VideoView,
  ImageView,
  ItemsView,
} from "@/components/ToolViews";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openComponent, setOpenComponent] = useState(false);
  const [componentData, setComponentData] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async (message) => {
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setIsTyping(true);

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-item": "application/json" },
      body: JSON.stringify({ query: message }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "agent", content: data.output }]);
    setIsTyping(false);

    if (data.action) {
      console.log(data.action);
      switch (data.action.type || data.action) {
        case "Calendar shown":
          useStore.getState().setOpenCalender();
          setOpenReport(false);
          setOpenComponent(false);
          setCalendar(data.action);
          break;

        case "Calendar hidden":
          useStore.getState().setCloseCalender();
          break;

        case "Report shown":
          setOpenReport(true);
          setOpenComponent(false);
          useStore.getState().setCloseCalender();
          break;

        case "Report hidden":
          setOpenReport(false);
          break;

        case "Chart shown":
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "chart", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Table shown":
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "table", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Code shown": 
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "code", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Video shown":
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "video", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Image shown":
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "image", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Items shown":
          setOpenReport(false);
          setOpenComponent(true);
          setComponentData({ item: "items", ...data.action });
          useStore.getState().setCloseCalender();
          break;

        case "Component hidden":
          setOpenComponent(false);
          setComponentData(null);
          break;

        default:
          console.warn("Unknown action:", data.action);
          break;
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
              {/* <span className="text-xs text-gray-400">Compiling</span> */}
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
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
          transition={{ item: "spring", stiffness: 80 }}
          className="hidden lg:block ml-6"
        >
          <InstagramCalendar calendar={calendar} />
        </motion.div>
      )}

      {/* Report */}
      {openReport && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ item: "spring", stiffness: 80 }}
          className="hidden lg:block ml-6"
        >
          <ReportCard />
        </motion.div>
      )}

      {/* Dynamic Components */}
      {openComponent && componentData && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ item: "spring", stiffness: 80 }}
          className="hidden lg:block ml-6 max-h-[85vh] overflow-y-auto"
        >
          {componentData.item === "chart" && (
            <Chart
              chartType={componentData.chartType}
              data={componentData.data}
              options={componentData.options}
            />
          )}
          {componentData.item === "table" && (
            <TableView
              columns={componentData.columns}
              rows={componentData.rows}
              options={componentData.options}
            />
          )}
          {componentData.item === "code" && (
            <CodeView
              language={componentData.language}
              code={componentData.code}
              options={componentData.options}
            />
          )}
          {componentData.item === "video" && (
            <VideoView url={componentData.url} options={componentData.options} />
          )}
          {componentData.item === "image" && (
            <ImageView
              url={componentData.url}
              alt={componentData.alt}
              options={componentData.options}
            />
          )}
          {componentData.item === "items" && (
            <ItemsView items={componentData.items} options={componentData.options} />
          )}
        </motion.div>
      )}
    </div>
  );
}
