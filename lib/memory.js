
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationBufferMemory } from "langchain/memory";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HumanMessage, AIMessage } from "langchain/schema";

// 🔑 Make sure you set your API key in terminal first:
// export OPENAI_API_KEY="your_api_key_here"

// 1. LLM
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

// 2. Short-term memory (in RAM)
const shortTermMemory = new ConversationBufferMemory({
  returnMessages: true,
  memoryKey: "history",
});

// 3. Long-term memory (vector DB)
const embeddings = new OpenAIEmbeddings();
const vectorStore = await HNSWLib.fromTexts([], [], embeddings);

// 📌 Save important facts into long-term memory (with summarization)
async function saveToLongTermMemory(text) {
  const summaryPrompt = `Extract the key fact from this sentence and make it short:\n"${text}"`;
  const summaryResponse = await llm.call([new HumanMessage(summaryPrompt)]);
  const fact = summaryResponse.content.trim();

  await vectorStore.addDocuments([{ pageContent: fact }]);

  console.log("💾 Saved to long-term memory:", fact);
}

// 📌 Recall facts from long-term memory
async function recallFromLongTermMemory(query) {
  const results = await vectorStore.similaritySearch(query, 2);
  return results.map(r => r.pageContent).join("\n");
}

// 📌 Main agent function
async function agentReply(userInput) {
  // Step 1: Save user input to short-term memory
  shortTermMemory.chatHistory.addMessage(new HumanMessage(userInput));

  // Step 2: Retrieve relevant long-term facts
  const relevantFacts = await recallFromLongTermMemory(userInput);

  // Step 3: Build context
  const shortTerm = (await shortTermMemory.loadMemoryVariables({})).history
    .map(msg => `${msg._getType()}: ${msg.content}`)
    .join("\n");
  const context = `Short-term:\n${shortTerm}\n\nLong-term:\n${relevantFacts}\n`;

  // Step 4: Call LLM
  const response = await llm.call([new HumanMessage(context + "\nUser: " + userInput)]);

  // Step 5: Save AI reply into short-term memory
  shortTermMemory.chatHistory.addMessage(new AIMessage(response.content));

  return response.content;
}

// 🔹 Example conversation
console.log(await agentReply("Hi, I’m Youssef, I’m building an e-commerce app."));
await saveToLongTermMemory("User's name is Youssef and he is building an e-commerce app.");

console.log(await agentReply("What stack should I use?"));
console.log(await agentReply("By the way, I’m learning PyTorch."));
await saveToLongTermMemory("User is learning PyTorch.");

console.log(await agentReply("Remind me what I’m learning?"));
