
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
    async ({ caption }) => {
        try {
            const response = await axios.post(
                    `https://graph.facebook.com/v20.0/${process.env.IG_USER_ID}/media`,
                    {
                    image_url: "https://blog.altabel.com/wp-content/uploads/2022/05/AI-and-ecommerce.png",
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
        description: "Post a caption to Instagram",
        schema: z.object({
        caption: z.string().describe("Caption text for the Instagram post"),
        }),
    }
)