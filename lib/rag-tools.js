

import { longTermMemory } from './longTermMemory.js';
import { tool } from '@langchain/core/tools';
import axios from "axios"
import { z } from 'zod';

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
    async ({ key, fact }) => {
        try {
            const success = await longTermMemory.storeImportantFact(key, fact);
            const memoryDB = await axios.post(`${process.env.URL}/api/memory`, { key })
            return (success && memoryDB) ? '✅ Important fact stored' : "❌ Failed to store important fact.";
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










    

// showChart.invoke({ query: "hide", code: "chat"});