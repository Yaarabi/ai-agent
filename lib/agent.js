

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
// import { pull } from "langchain/hub";
// import { MemorySaver } from "@langchain/langgraph";
import { MemorySaver, InMemoryStore } from "@langchain/langgraph"; 
// import { InMemoryStore } from "@langchain/langgraph/store/memory";
import { weatherTool, calculator_tool, postToInstagram } from "./custom-tools.js";
import dotenv from 'dotenv';



dotenv.config();

const memory = new MemorySaver()

const checkpoint = new MemorySaver();
const store = new InMemoryStore();

        
const model = new ChatMistralAI({
            model: "mistral-large-latest",
            apiKey: process.env.MISTRAL_API_KEY,
            temperature: 0.7,
        });

        

        
const tools = [weatherTool, calculator_tool, postToInstagram];

        
        // const prompt = await pull("hwchase17/openai-functions-agent");

        
export const agent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpoint, 
    // memory,
    prompt: "You are Yura, an intelligent and friendly AI assistant created by Youssef...",
    // verbose: true,
});


export const testAgent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpoint, 
    // store,
    });

const response = async (text) => {

    const res = await testAgent.invoke({
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

        console.log(res.messages.at(-1).content);
}

// response("hi, my name is youssef")
// response("what is my name?")

// const run = async () => {
//   await response("hi, my name is youssef");   // ✅ wait until finished
//   await response("what is my name?");         // ✅ now it remembers
// };

// run();


