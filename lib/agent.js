

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
// import { pull } from "langchain/hub";
// import { MemorySaver } from "@langchain/langgraph";
import { MemorySaver, InMemoryStore } from "@langchain/langgraph"; 
// import { InMemoryStore } from "@langchain/langgraph/store/memory";
import {postToInstagram, 
    storeInDB, getFromMemory, searchImagesTool, showInstaCalendar, calculator_tool, manageConversation, showReport, getMemoryStats, cleanupMemories, getConversationContext, storeImportantFact, checkAndSummarize, showChart } from "./custom-tools.js";
import dotenv from 'dotenv';



dotenv.config();

const memory = new MemorySaver() 

const checkpoint = new MemorySaver(); // this, i use to save the agent state between invocations
const store = new InMemoryStore();

        
const model = new ChatMistralAI({
            model: "mistral-large-latest",
            apiKey: process.env.MISTRAL_API_KEY,
            temperature: 0.7,
        });

        

        
const tools = [searchImagesTool, postToInstagram, 
                storeInDB, getFromMemory, 
                showInstaCalendar, calculator_tool,
                manageConversation, showReport, 
                getMemoryStats, cleanupMemories, 
                getConversationContext, storeImportantFact, 
                checkAndSummarize, showChart];

        
        // const prompt = await pull("hwchase17/openai-functions-agent");

        
export const agent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpoint, 
    // memory,
    prompt: "You are Yura, an intelligent and friendly AI assistant created by Youssef...",
    verbose: true,
});


export const testAgent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpoint, 
    // store,
    });

const response = async (text) => {

    const res = await agent.invoke({
            messages: [{ 
                role: "user", 
                content: text 
            }],
            },
            {
            configurable: {
                thread_id: "thread-1",
                recursionLimit: 5,
            },
            }
        );

        console.log(res);
}

// response("hi, we gana build a SASS that help selers in e-commerce to increase their sales by using AI, so gana made an AI agent that can manage instagram account and can support in whatsapp to answer the clients questions, so keep it in mind")
// response("how much i will pay if i want to buy 5 GAMA products?")
// response("show a chart of numbers of people in the world, in the last 10 years")

// const run = async () => {
//   await response("hi, my name is youssef");   // ✅ wait until finished
//   await response("what is my name?");         // ✅ now it remembers
// };

// run();


