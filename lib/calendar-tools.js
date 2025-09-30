import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";

const calendarEntrySchema = z.object({
    day: z.string(),
    time: z.string(),
    type: z.string(),
    content: z.string(),
    caption: z.string()
});

const calendarSchema = z.object({
    key: z.string(),
    value: z.array(calendarEntrySchema)
});

export const calendarTool = tool(
    async ({ query, calendarPayload }) => {
        if (query === "open") {
        const res = await axios.get(`${process.env.URL}/api/calendar`);
        // console.log(res.data[0])
        return { type: "Calendar shown", ...res.data[0] }; // the error from here what the api return isn't what the ui wait for
        }
        if (query === "create" && calendarPayload) {
        const res = await axios.post(`${process.env.URL}/api/calendar`, calendarPayload);
        return { type: "Calendar shown", ...calendarPayload  };
        }
        if (query === "update" && calendarPayload) {
        const res = await axios.post(`${process.env.URL}/api/calendar`, calendarPayload);
        // console.log(calendarPayload)
        return { type: "Calendar shown", ...calendarPayload };
        }
        if (query === "close") {
        return "Calendar hidden";
        }
        return "Invalid query";
    },
    {
        name: "calendar_tool",
        description: `
        Show, create, update, or hide the Instagram calendar.
        Use 'open' to fetch and show, 'create' to create, 'update' to update, 'close' to hide.
        when you need to update somthing, you need to 
        `,
        schema: z.object({
        query: z.enum(["open", "create", "update", "close"]),
        calendarPayload: calendarSchema.optional()
        })
    }
    );



