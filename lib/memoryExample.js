// import { longTermMemory } from './longTermMemory.js';

// // Example usage of the long-term memory system
// export async function demonstrateMemorySystem() {
//     console.log("🧠 Long-Term Memory System Demo\n");

//     // 1. Store important facts
//     console.log("1. Storing important facts...");
//     await longTermMemory.storeImportantFact("Youssef is building a SASS platform for e-commerce sellers", "business_info");
//     await longTermMemory.storeImportantFact("The platform uses AI agents for Instagram management and WhatsApp support", "technical");
//     await longTermMemory.storeImportantFact("GAMA products cost $3 each", "product_info");

//     // 2. Store user preferences
//     console.log("2. Storing user preferences...");
//     await longTermMemory.storeUserPreference("communication_style", "friendly and professional");
//     await longTermMemory.storeUserPreference("posting_frequency", "daily");

//     // 3. Simulate a conversation
//     console.log("3. Simulating conversation...");
//     longTermMemory.addToBuffer("user", "Hi, I'm Youssef. I'm building an AI-powered SASS for e-commerce.");
//     longTermMemory.addToBuffer("assistant", "That sounds exciting! I can help you with Instagram management and customer support.");
//     longTermMemory.addToBuffer("user", "Great! I want to post daily content to increase brand awareness.");
//     longTermMemory.addToBuffer("assistant", "Perfect! I can help you create and schedule daily Instagram posts.");
//     longTermMemory.addToBuffer("user", "Also, I need help calculating prices for my GAMA products.");

//     // 4. Retrieve relevant memories
//     console.log("4. Retrieving relevant memories...");
//     const businessMemories = await longTermMemory.retrieveMemories("SASS platform e-commerce");
//     console.log("Business memories:", businessMemories);

//     const productMemories = await longTermMemory.retrieveMemories("GAMA products pricing");
//     console.log("Product memories:", productMemories);

//     // 5. Get conversation context
//     console.log("5. Getting conversation context...");
//     const context = await longTermMemory.getConversationContext("Instagram posting");
//     console.log("Context:", context);

//     // 6. Summarize conversation
//     console.log("6. Summarizing conversation...");
//     const summary = await longTermMemory.summarizeConversation();
//     console.log("Summary:", summary);

//     // 7. Get memory statistics
//     console.log("7. Memory statistics...");
//     const stats = await longTermMemory.getMemoryStats();
//     console.log("Stats:", stats);

//     console.log("\n✅ Memory system demo completed!");
// }

// // Example of how to integrate with your agent
// export async function integrateWithAgent(userMessage, agentResponse) {
//     // Add user message to buffer
//     longTermMemory.addToBuffer("user", userMessage);
    
//     // Add agent response to buffer
//     longTermMemory.addToBuffer("assistant", agentResponse);
    
//     // Check if we should summarize (every 5 interactions)
//     const summary = await longTermMemory.checkAndSummarize();
//     if (summary) {
//         console.log("📝 Conversation summarized:", summary);
//     }
    
//     // Get relevant context for future interactions
//     const context = await longTermMemory.getConversationContext(userMessage);
//     return context;
// }

// // Example of storing important information during conversation
// export async function storeImportantInfo(info, category) {
//     const success = await longTermMemory.storeImportantFact(info, category);
//     if (success) {
//         console.log(`✅ Stored important info in category '${category}': ${info}`);
//     } else {
//         console.log(`❌ Failed to store info: ${info}`);
//     }
//     return success;
// }

// // Example of retrieving user preferences
// export async function getUserPreferences() {
//     const preferences = await longTermMemory.retrieveMemories("user preferences");
//     return preferences;
// }

// // Run demo if this file is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//     demonstrateMemorySystem().catch(console.error);
// }

