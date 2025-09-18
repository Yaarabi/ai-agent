
"use client";
import { useEffect, useRef } from "react";

    const sampleReport = [
    {
        title: "Instagram Growth",
        metric: "+120 Followers",
        detail: "Your audience grew by 15% compared to last week.",
        type: "success",
    },
    {
        title: "Engagement Rate",
        metric: "8.3%",
        detail: "Engagement increased due to consistent posting.",
        type: "info",
    },
    {
        title: "Top Post",
        metric: "Tuesday Reel",
        detail: "Received 2.3k views and 350 likes.",
        type: "highlight",
    },
    {
        title: "Client Leads",
        metric: "12 New Leads",
        detail: "Generated via Instagram DMs and link clicks.",
        type: "success",
    },
    ];

const ReportCard = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

return (
        <div className="h-screen w-full max-w-xl mx-auto bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            📊 Weekly Report
            </h2>
            <p className="text-sm text-gray-400">Summary of your performance</p>
        </div>

        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
        >
            {sampleReport.map((item, index) => (
            <div
                key={index}
                className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                item.type === "success"
                    ? "border-green-500/30 hover:shadow-green-500/10"
                    : item.type === "highlight"
                    ? "border-yellow-500/30 hover:shadow-yellow-500/10"
                    : "border-purple-500/30 hover:shadow-purple-500/10"
                }`}
            >
                <h3 className="text-lg font-semibold text-purple-300">
                {item.title}
                </h3>
                <p className="text-xl font-bold text-gray-100">{item.metric}</p>
                <p className="text-sm text-gray-400 mt-1">{item.detail}</p>
            </div>
            ))}
        </div>

        <div className="p-4 border-t border-gray-800 text-center">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold shadow-md hover:opacity-90 transition">
            Export Report
            </button>
        </div>
        </div>
    );
};

export default ReportCard;
