


const instagram_calendar = [
    {
        day: "Monday",
        time: "11:00 AM",
        type: "Carousel",
        content: "Include 4–6 slides with practical tech tips (e.g., website performance, cybersecurity basics, automation tools).",
        caption: "Summarize the tips with a friendly tone. Include a call-to-action like 'Save this!' or 'Tag a teammate who needs this.'"
    },
    {
        day: "Tuesday",
        time: "10:30 AM",
        type: "Reel",
        content: "Showcase a trending tech tool or app. Use quick cuts or screen recordings to demonstrate its value.",
        caption: "Explain why the tool is useful. Mention how Yura IT uses it. Include hashtags like #ToolTuesday or #TechStack."
    },
    {
        day: "Wednesday",
        time: "11:00 AM",
        type: "Story",
        content: "Create a poll or Q&A sticker. Ask followers about their tech preferences or challenges.",
        caption: "Encourage interaction. Use phrases like 'We want your input!' or 'Drop your questions below.'"
    },
    {
        day: "Thursday",
        time: "11:30 AM",
        type: "Reel",
        content: "Behind-the-scenes look at your team, workspace, or project workflow. Keep it authentic and casual.",
        caption: "Highlight your team’s culture or process. Use hashtags like #InsideYura or #TechLife."
    },
    {
        day: "Friday",
        time: "10:00 AM",
        type: "Carousel or Static Post",
        content: "Share a client success story or case study. Include before/after results or a quote from the client.",
        caption: "Focus on the transformation and impact. Use a CTA like 'Want results like this? DM us.'"
    },
    {
        day: "Saturday",
        time: "9:00 PM",
        type: "Meme or Quote",
        content: "Post a light-hearted tech meme or motivational quote relevant to IT professionals.",
        caption: "Keep it humorous or inspiring. Use hashtags like #WeekendVibes or #TechHumor."
    }
];

const InstagramCalendar = () => {
    return (
        <div className="bg-gray-850 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📅 Yura IT Instagram Content Calendar</h2>
        <div className="space-y-6">
            {instagram_calendar.map((entry, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-2">{entry.day} — {entry.time}</h3>
                <p><span className="font-medium">Type:</span> {entry.type}</p>
                <p><span className="font-medium">Content Guidance:</span> {entry.content}</p>
                <p><span className="font-medium">Caption Guidance:</span> {entry.caption}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default InstagramCalendar;
