import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

class LongTermMemory {
    constructor() {
        this.conversationBuffer = [];
        this.maxBufferSize = 10; // Keep last 10 messages in buffer
        this.summarizationThreshold = 5; // Summarize after 5 interactions
    }

    // Create embeddings using Mistral
    async createEmbeddings(content) {
        try {
            const embeddings = await mistralClient.embeddings.create({
                model: 'mistral-embed',
                inputs: [content]
            });
            return embeddings.data[0].embedding;
        } catch (error) {
            console.error("Embedding creation error:", error);
            throw error;
        }
    }

    // Store conversation or important information
    async storeMemory(key, value) {
        try {
            const embedding = await this.createEmbeddings(key);
            // const timestamp = new Date().toISOString();
            
            // Store metadata as part of content for now (since metadata column doesn't exist)
            // const enrichedContent = `[${metadata.type || 'conversation'}] ${content}`;
            
            const { data, error } = await supabase.from('handbook_docs').insert([
                { 
                    key,
                    value, 
                    embedding
                }
            ]);

            if (error) {
                console.error("Supabase Insert Error:", error);
                return false;
            } else {
                console.log("✅ Memory stored successfully");
                return true;
            }
        } catch (error) {
            console.error("Memory storage error:", error);
            return false;
        }
    }

    // Retrieve relevant memories
    async retrieveMemories(query, limit = 5, threshold = 0.78) {
        try {
            const embedding = await this.createEmbeddings(query);
            const { data } = await supabase.rpc('match_handbook_docs', {
                query_embedding: embedding,
                match_threshold: threshold,
                match_count: limit
            });

            if (!data) return "";
            
            const combinedContext = data.map(match => match.content).join('\n\n');
            console.log("🧠 Retrieved memories:", data.length, "matches");
            return combinedContext;
        } catch (error) {
            console.error("Memory retrieval error:", error);
            return "";
        }
    }

    // Add message to conversation buffer
    addToBuffer(role, content) {
        this.conversationBuffer.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        // Keep buffer size manageable
        if (this.conversationBuffer.length > this.maxBufferSize) {
            this.conversationBuffer = this.conversationBuffer.slice(-this.maxBufferSize);
        }
    }

    // Summarize conversation buffer
    async summarizeConversation() {
        if (this.conversationBuffer.length === 0) return "";

        try {
            const conversationText = this.conversationBuffer
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n');

            const summaryPrompt = `Summarize this conversation, focusing on key facts, decisions, and important information that should be remembered for future interactions:\n\n${conversationText}`;

            const response = await mistralClient.chat.complete({
                model: "mistral-large-latest",
                messages: [{ role: "user", content: summaryPrompt }],
                temperature: 0.3
            });

            const summary = response.choices[0].message.content;
            
            // Store the summary in long-term memory
            await this.storeMemory(summary, {
                type: 'conversation_summary',
                original_length: this.conversationBuffer.length
            });

            // Clear the buffer after summarization
            this.conversationBuffer = [];
            
            console.log("📝 Conversation summarized and stored");
            return summary;
        } catch (error) {
            console.error("Conversation summarization error:", error);
            return "";
        }
    }

    // Check if we should summarize and store
    async checkAndSummarize() {
        if (this.conversationBuffer.length >= this.summarizationThreshold) {
            return await this.summarizeConversation();
        }
        return null;
    }

    // Store important facts or user preferences
    async storeImportantFact(fact, category = 'general') {
        return await this.storeMemory(fact, {
            type: 'important_fact',
            category
        });
    }

    // Store user preferences
    async storeUserPreference(preference, value) {
        return await this.storeMemory(`User prefers: ${preference} = ${value}`, {
            type: 'user_preference',
            preference,
            value
        });
    }

    // Get conversation context for agent
    async getConversationContext(query) {
        // Get relevant long-term memories
        const longTermMemories = await this.retrieveMemories(query);
        
        // Get recent conversation buffer
        const recentContext = this.conversationBuffer
            .slice(-3) // Last 3 messages
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        return {
            longTerm: longTermMemories,
            recent: recentContext,
            hasRecentContext: recentContext.length > 0
        };
    }

    // Clean up old memories (optional maintenance function)
    async cleanupOldMemories(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const { error } = await supabase
                .from('handbook_docs')
                .delete()
                .lt('created_at', cutoffDate.toISOString())
                .like('content', '[conversation_summary]%');

            if (error) {
                console.error("Memory cleanup error:", error);
                return false;
            }

            console.log("🧹 Old memories cleaned up");
            return true;
        } catch (error) {
            console.error("Memory cleanup error:", error);
            return false;
        }
    }

    // Get memory statistics
    async getMemoryStats() {
        try {
            const { data, error } = await supabase
                .from('handbook_docs')
                .select('content');

            if (error) {
                console.error("Memory stats error:", error);
                return null;
            }

            const stats = {
                total: data.length,
                byType: {},
                byCategory: {}
            };

            data.forEach(item => {
                // Parse type from content format [type] content
                const typeMatch = item.content.match(/^\[([^\]]+)\]/);
                const type = typeMatch ? typeMatch[1] : 'unknown';

                stats.byType[type] = (stats.byType[type] || 0) + 1;
            });

            return stats;
        } catch (error) {
            console.error("Memory stats error:", error);
            return null;
        }
    }
}

// Create singleton instance
export const longTermMemory = new LongTermMemory();

// Export individual functions for backward compatibility
export const createEmbeddings = (content) => longTermMemory.createEmbeddings(content);
export const storeInSupabase = (key, value) => longTermMemory.storeMemory(key, value);
export const retrieveMatches = (query) => longTermMemory.retrieveMemories(query);
