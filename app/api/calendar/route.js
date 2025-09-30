
import { connectDB } from "@/lib/db.js";
import Calendar from "@/models/calendar.js";

export async function GET() {
    await connectDB();

    try {
        const calendar = await Calendar.find();
        if (!calendar) {
        return Response.json({ error: "Calendar not found" }, { status: 404 });
        }

        return Response.json(calendar, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
    }

export async function POST(request) {
    await connectDB();

    try {
        const { key, value } = await request.json();

        let calendar = await Calendar.findOne({ key });
        if (calendar) {
        calendar.value = value;
        calendar.lastUpdated = new Date();
        await calendar.save();
        } else {
        calendar = await Calendar.create({ key, value });
        }

        return Response.json(calendar, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 400 });
    }
    }

