import mongoose from "mongoose";

const calendarEntrySchema = new mongoose.Schema({
    day: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    content: { type: String, required: true },
    caption: { type: String, required: true }
});

const calendarSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: [calendarEntrySchema], required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.Calendar || mongoose.model("Calendar", calendarSchema);