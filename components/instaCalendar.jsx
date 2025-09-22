    import { useRef, useEffect } from "react";

const InstagramCalendar = ({ calendar }) => {
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
            📅 {calendar.key}
            </h2>
        </header>

        {/* Scrollable content */}
        <div
            ref={calendarRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
            {calendar.value.map((entry, index) => (
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
