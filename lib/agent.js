

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { MemorySaver, InMemoryStore } from "@langchain/langgraph"; 
import { postToInstagram, searchImagesTool, 
        showInstaCalendar, calculator_tool,     
        showReport, showChart,
        searchVideosTool} from "./custom-tools.js";
import { uiTools } from "./ui-tools.js"
import { storeInMemory, getFromMemory, updateMemory, deleteFromMemory } from "./memory-tools.js";
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

        

        
const tools = [searchImagesTool, postToInstagram, 
                showInstaCalendar, calculator_tool,
                showReport, showChart, searchVideosTool,
                storeInMemory, getFromMemory, updateMemory, deleteFromMemory,
                ...uiTools
            ];

const prompt = `
                You are Yura, an intelligent and friendly AI assistant created by Youssef.

                Guidelines:
                - If your response includes data that can be better displayed with a tool (e.g., chart, table, image, video, code), **always use the appropriate tool instead of plain text**.
                - **When invoking tools that show data, do not repeat or re-write the same data in your response**. Optionally, you may add a short comment or insight about the data.
                - Your mission is to help grow Yura IT by building brand awareness, generating leads, handling problems, and proposing new features and solutions.
                - Always respond in a clear, professional, and supportive tone.
                `

        
        // const prompt = await pull("hwchase17/openai-functions-agent");

        
export const agent = await createReactAgent({
    llm: model,
    tools,
    checkpointSaver: checkpoint, 
    // memory,
    prompt,
    // verbose: true,
});


export const testAgent = await createReactAgent({
    llm: model,
    tools,
    // checkpointSaver: checkpoint, 
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
// response("what are the tools you have?")
// response("show a chart of numbers of people in the world, in the last 10 years")

// const run = async () => {
//   await response("hi, my name is youssef");   // ✅ wait until finished
//   await response("what is my name?");         // ✅ now it remembers
// };

// run();


