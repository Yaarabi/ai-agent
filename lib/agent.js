import { AgentExecutor, createReactAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { DynamicTool } from "langchain/tools";
import Order from "../models/order"; 
import { connectDB } from "./db";  
import { MistralAI } from "@langchain/mistralai";
import 'dotenv/config';

const llm = new MistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
    // mistral-large-latest
    // codestral-latest
});

const memory = new BufferMemory();

const orderCountTool = new DynamicTool({
    name: "order_count",
    description: "Returns the total number of orders in the database.",
    func: async () => {
        await connectDB();
        const count = await Order.countDocuments();
        return `There are ${count} orders in the database.`;
    },
});

export async function createAgent() {
    const tools = [orderCountTool];

    const prompt = ChatPromptTemplate.fromMessages(
    [
        ["system", `You are a helpful chatbot assistant. Use your memory to keep track of the conversation.

Available tools:
${tools.map(t => `- ${t.name}: ${t.description}`).join("\n")}

When you want to use a tool, respond with the tool name and input in this format:
[tool_name](tool_input)

If you don't need to use any tools, just answer the question directly.
`],
        ["human", "{input}"],
        ["system", "{agent_scratchpad}"]
    ],
    {
        inputVariables: ["input", "agent_scratchpad"]  // ✅ explicitly define variables
    }
);


    const agent = await createReactAgent({
        llm,
        // prompt,
        memory,
        tools, 
    });

    const executor = AgentExecutor.fromAgentAndTools({
        agent,
        tools, 
        verbose: true,
    });

    return executor;
}