    import { useRef, useEffect } from "react";

    const instagram_calendar = [
    {
        day: "Monday",
        time: "11:00 AM",
        type: "Carousel",
        content:
        "Include 4–6 slides with practical tech tips (e.g., website performance, cybersecurity basics, automation tools).",
        caption:
        "Summarize the tips with a friendly tone. Include a call-to-action like 'Save this!' or 'Tag a teammate who needs this.'",
    },
    {
        day: "Tuesday",
        time: "10:30 AM",
        type: "Reel",
        content:
        "Showcase a trending tech tool or app. Use quick cuts or screen recordings to demonstrate its value.",
        caption:
        "Explain why the tool is useful. Mention how Yura IT uses it. Include hashtags like #ToolTuesday or #TechStack.",
    },
    {
        day: "Wednesday",
        time: "11:00 AM",
        type: "Story",
        content:
        "Create a poll or Q&A sticker. Ask followers about their tech preferences or challenges.",
        caption:
        "Encourage interaction. Use phrases like 'We want your input!' or 'Drop your questions below.'",
    },
    {
        day: "Thursday",
        time: "11:30 AM",
        type: "Reel",
        content:
        "Behind-the-scenes look at your team, workspace, or project workflow. Keep it authentic and casual.",
        caption:
        "Highlight your team’s culture or process. Use hashtags like #InsideYura or #TechLife.",
    },
    {
        day: "Friday",
        time: "10:00 AM",
        type: "Carousel or Static Post",
        content:
        "Share a client success story or case study. Include before/after results or a quote from the client.",
        caption:
        "Focus on the transformation and impact. Use a CTA like 'Want results like this? DM us.'",
    },
    {
        day: "Saturday",
        time: "9:00 PM",
        type: "Meme or Quote",
        content:
        "Post a light-hearted tech meme or motivational quote relevant to IT professionals.",
        caption:
        "Keep it humorous or inspiring. Use hashtags like #WeekendVibes or #TechHumor.",
    },
    ];

const InstagramCalendar = () => {
    const calendarRef = useRef(null);

    useEffect(() => {
        if (calendarRef.current) {
        calendarRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

return (
        <div className="h-[90vh] w-full max-w-lg bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex flex-col">
        <header className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            📅 Yura IT Instagram Calendar
            </h2>
        </header>

        {/* Scrollable content */}
        <div
            ref={calendarRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
            {instagram_calendar.map((entry, index) => (
            <div
                key={index}
                className="border border-gray-700 rounded-xl p-4 transition-all hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10"
            >
                <h3 className="text-lg font-semibold text-purple-300 mb-2">
                {entry.day} — {entry.time}
                </h3>
                <p className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">Type:</span>{" "}
                {entry.type}
                </p>
                <p className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">Content:</span>{" "}
                {entry.content}
                </p>
                <p className="text-sm text-gray-300">
                <span className="font-medium text-gray-200">Caption:</span>{" "}
                {entry.caption}
                </p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default InstagramCalendar;
