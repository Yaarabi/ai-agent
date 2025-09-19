
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
import { longTermMemory } from './longTermMemory.js';
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
    async ({ content, category = 'general' }) => {
        const success = await longTermMemory.storeImportantFact(content, category);
        return success ? "Content stored successfully in long-term memory." : "Failed to store content.";
    },
    {
        name: "store_in_db",
        description: "Store important information and conversation summaries in the database. Only use this tool if the information is important for future conversations, and keep content short.",
        schema: z.object({
        content: z.string().describe("The content to store"),
        category: z.string().optional().describe("Category of the information (e.g., 'user_preference', 'business_info', 'technical')"),
        }),
    }
);

export const getFromMemory = tool(
    async ({ query }) => {
        const context = await longTermMemory.retrieveMemories(query);
        return context || "No relevant memories found.";
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
        description: "Open or close the Instagram calendar. Input should be 'open' or 'close'. (close other component like report if it opened)",
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
        description: "Show or hide the weekly performance report. Input should be 'show' or 'hide'.(close other component like calendar if it opened)",
        schema: z.object({
        query: z.string().describe("Either 'show' to display the report or 'hide' to conceal it")   
        }),
    }
);

export const manageConversation = tool(
    async ({ action, content }) => {
        try {
            switch (action) {
                case "add_message":
                    longTermMemory.addToBuffer("user", content);
                    return "Message added to conversation buffer.";
                
                case "add_ai_response":
                    longTermMemory.addToBuffer("assistant", content);
                    return "AI response added to conversation buffer.";
                
                case "summarize":
                    const summary = await longTermMemory.summarizeConversation();
                    return summary ? `Conversation summarized: ${summary}` : "No conversation to summarize.";
                
                case "get_context":
                    const context = await longTermMemory.getConversationContext(content);
                    return `Recent context: ${context.recent}\n\nLong-term memories: ${context.longTerm}`;
                
                case "store_preference":
                    const success = await longTermMemory.storeUserPreference(content.split('=')[0], content.split('=')[1]);
                    return success ? "User preference stored." : "Failed to store preference.";
                
                default:
                    return "Invalid action. Use: add_message, add_ai_response, summarize, get_context, or store_preference";
            }
        } catch (error) {
            console.error("Conversation management error:", error);
            return "Error managing conversation.";
        }
    },
    {
        name: "manage_conversation",
        description: "Manage conversation flow and memory. Actions: add_message, add_ai_response, summarize, get_context, store_preference",
        schema: z.object({
            action: z.string().describe("Action to perform: add_message, add_ai_response, summarize, get_context, store_preference"),
            content: z.string().describe("Content for the action (message text, query, or preference in format 'key=value')")
        }),
    }
);

export const getMemoryStats = tool(
    async () => {
        try {
            const stats = await longTermMemory.getMemoryStats();
            if (!stats) {
                return "Unable to retrieve memory statistics.";
            }
            
            const statsText = `📊 Memory Statistics:
Total memories: ${stats.total}
By type:
${Object.entries(stats.byType).map(([type, count]) => `  - ${type}: ${count}`).join('\n')}`;
            
            return statsText;
        } catch (error) {
            console.error("Memory stats error:", error);
            return "Error retrieving memory statistics.";
        }
    },
    {
        name: "get_memory_stats",
        description: "Get statistics about stored memories including total count and breakdown by type",
        schema: z.object({}),
    }
);

export const cleanupMemories = tool(
    async ({ daysOld = 30 }) => {
        try {
            const success = await longTermMemory.cleanupOldMemories(daysOld);
            return success ? `✅ Cleaned up memories older than ${daysOld} days.` : "❌ Failed to cleanup old memories.";
        } catch (error) {
            console.error("Memory cleanup error:", error);
            return "Error during memory cleanup.";
        }
    },
    {
        name: "cleanup_memories",
        description: "Clean up old conversation summaries and memories to maintain database performance",
        schema: z.object({
            daysOld: z.number().optional().describe("Number of days old memories to keep (default: 30)")
        }),
    }
);

export const getConversationContext = tool(
    async ({ query, includeRecent = true }) => {
        try {
            const context = await longTermMemory.getConversationContext(query);
            
            let response = "";
            if (context.longTerm) {
                response += `🧠 Long-term memories:\n${context.longTerm}\n\n`;
            }
            
            if (includeRecent && context.hasRecentContext) {
                response += `💬 Recent conversation:\n${context.recent}`;
            }
            
            return response || "No relevant context found.";
        } catch (error) {
            console.error("Context retrieval error:", error);
            return "Error retrieving conversation context.";
        }
    },
    {
        name: "get_conversation_context",
        description: "Get comprehensive conversation context including both long-term memories and recent conversation buffer",
        schema: z.object({
            query: z.string().describe("Query to search for relevant context"),
            includeRecent: z.boolean().optional().describe("Whether to include recent conversation buffer (default: true)")
        }),
    }
);

export const storeImportantFact = tool(
    async ({ fact, category = 'general' }) => {
        try {
            const success = await longTermMemory.storeImportantFact(fact, category);
            return success ? `✅ Important fact stored in category: ${category}` : "❌ Failed to store important fact.";
        } catch (error) {
            console.error("Store fact error:", error);
            return "Error storing important fact.";
        }
    },
    {
        name: "store_important_fact",
        description: "Store an important fact or piece of information for future reference",
        schema: z.object({
            fact: z.string().describe("The important fact or information to store"),
            category: z.string().optional().describe("Category for the fact (e.g., 'user_info', 'business', 'technical')")
        }),
    }
);

export const checkAndSummarize = tool(
    async () => {
        try {
            const summary = await longTermMemory.checkAndSummarize();
            if (summary) {
                return `📝 Conversation automatically summarized and stored:\n${summary}`;
            } else {
                return "No summarization needed at this time.";
            }
        } catch (error) {
            console.error("Auto-summarize error:", error);
            return "Error during automatic summarization.";
        }
    },
    {
        name: "check_and_summarize",
        description: "Check if conversation buffer needs summarization and automatically summarize if threshold is reached",
        schema: z.object({}),
    }
);
