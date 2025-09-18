
import { Tool } from 'langchain/tools';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: '../../.env' });


export class WeatherTool extends Tool {
    name = 'weather';
    description = 'Get the current weather for any city. Use this tool when a user asks about weather in a location. Input should be just the city name, e.g. "Igli".';

    async _call(input) {
        console.log("WeatherTool called with:", input);
        const city = input.trim().toLowerCase();

        if (city === "igli") {
            return "☀️ The weather in Igli is very hot (katntn).";
        }

        return `🌤️ The weather in ${input} is great (ifjij).`;
    }
}


export class CalculatorTool extends Tool {
    name = 'calculator';
    description = "Calculate the total price for GAMA products. Each costs 3$. Input should be a number (the quantity).";    
    async _call(input) {
        const qty = Number(input);
        return `The total price is $${qty * 3}`;
    }

}

const access_token = process.env.ACCESS_TOKEN;
const ig_user_id = process.env.IG_USER_ID;
const imageUrl ="https://tse2.mm.bing.net/th/id/OIP.blCoqZ5YTkka3DOclT2IwgHaD4?rs=1&pid=ImgDetMain&o=7&rm=3"

export class PostInInstagram extends Tool {
    name = "postToInstagram";
    description = 'Post a caption to Instagram. Input must be the caption text as a string. Example: "Check out my new product launch!"';

    async _call(input) {
        try {
            const caption = typeof input === "string" ? input : input.caption;

            const container = await axios.post(
                `https://graph.facebook.com/v20.0/${ig_user_id}/media`,
                {
                    image_url: imageUrl,
                    caption,
                    access_token: access_token,
                }
            );

            await axios.post(
                `https://graph.facebook.com/v20.0/${ig_user_id}/media_publish`,
                {
                    creation_id: container.data.id,
                    access_token: access_token,
                }
            );

            return "✅ Post published successfully!";
        } catch (err) {
            console.error("Instagram Post Error:", err.response?.data || err.message);
            return "❌ Failed to publish post.";
        }
    }
}


import { tool } from '@langchain/core/tools';
import { storeInSupabase, retrieveMatches } from './toolsFunctions.js';
import { z } from 'zod';

export const weatherTool = tool(
    async ({ city }) => {
        console.log(`Fetching weather for ${city}...`);
        // In a real app, you would call a weather API here
        return `The current weather in ${city} is clear and wonderful.`;
    },
    {
        name: "get_weather",
        description: "Get the current weather for a specified city",
        schema: z.object({
        city: z.string().describe("The city to get weather for"),
        }),
    }
);

export const calculator_tool = tool(
    async ({ qty }) => {
        const price = qty * 3;
        return `the total price is $${price}`;
    },
    {
        name: "calculator",
        description: "to calculate the total price for GAMA products.",
        schema: z.object({
        qty: z.number().describe("Quantity of GAMA products"),
        }),
    }
);

export const postToInstagram = tool(
    async ({ caption, url }) => {
        try {
            // || "https://tse2.mm.bing.net/th/id/OIP.blCoqZ5YTkka3DOclT2IwgHaD4?rs=1&pid=ImgDetMain&o=7&rm=3",
            const response = await axios.post(
                    `https://graph.facebook.com/v20.0/${process.env.IG_USER_ID}/media`,
                    {
                    image_url: url, 
                    caption: caption,
                    access_token: process.env.ACCESS_TOKEN,
                    }
                );

            await axios.post(
                    `https://graph.facebook.com/v20.0/${process.env.IG_USER_ID}/media_publish`,
                    {
                    creation_id: response.data.id,
                    access_token: process.env.ACCESS_TOKEN,
                    }
                );

            return "✅ Post published successfully!";
        } catch (err) {
            console.error("Instagram Post Error:", err.response?.data || err.message);
            return "❌ Failed to publish post.";
        }
    },
    {
        name: "post_to_instagram",
        description: "Post a caption and image URL to Instagram",
        schema: z.object({
        caption: z.string().describe("Caption text for the Instagram post"),
        url: z.string().url().describe("URL of the image to post"),
        }),
    }
)

export const storeInDB = tool(
    async ({ content }) => {
        await storeInSupabase(content);
        return "Content stored successfully.";
    },
    {
        name: "store_in_db",
        description: "Store important information and conversation summaries in the database. Only use this tool if the information is important for future conversations, and keep content short.",
        schema: z.object({
        content: z.string().describe("The content to store"),
        }),
    }
);

export const getFromMemory = tool(
    async ({ query }) => {
        const context = await retrieveMatches(query);
        // console.log("Retrieved context:", context);
        return context;
    },
    {
        name: "memory",
        description: "Use this when you need context, facts, or prior conversations that may help answer the current query.",
        schema: z.object({
            query: z.string().describe("The query or text input used to search for related memory entries"),
        }),
    }
);
// await getFromMemory.invoke({ query: "Yura IT" });

export const searchImagesTool = tool(
    async ({ query }) => {
        const pexelsKey = process.env.PEXELS_API_KEY; 

        try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            headers: {
            Authorization: pexelsKey
            },
            params: {
            query,
            per_page: 5
            }
        });

        const imageUrls = response.data.photos.map((photo) => photo.src.medium);
        // console.log("Pexels image URLs:", imageUrls);
        return imageUrls;

        } catch (error) {
        console.error('Pexels API error:', error);
        return [];
        }
    },
    {
        name: "search_images",
        description: "Finds image links from Pexels related to a topic.",
        schema: z.object({
        query: z.string().describe("The topic to search images for")
        }),
    }
);


// await searchImagesTool.invoke({ query: "AI e-commerce" });

export const showInstaCalendar = tool(
    async ({ query }) => {
        if(query === "open"){
            // useStore.getState().setOpenCalender();
            return "Calendar opened";
        }else if(query === "close"){
            // useStore.getState().setCloseCalender();
            return "Calendar closed";
        }
    },
    {
        name: "show_calendar",
        description: "Open or close the Instagram calendar. Input should be 'open' or 'close'.",
        schema: z.object({
        query: z.string().describe("Either 'open' to show the calendar or 'close' to hide it")
        }),
    }
)
export const showReport = tool(
    async ({ query }) => {
        if(query === "show"){
            // console.log("Report tool called to show report");
            return "Report shown";
        }else if(query === "hide"){
            return "Report hidden";
        }
    },
    {
        name: "show_report",
        description: "Show or hide the weekly performance report. Input should be 'show' or 'hide'.",
        schema: z.object({
        query: z.string().describe("Either 'show' to display the report or 'hide' to conceal it")   
        }),
    }
)   
