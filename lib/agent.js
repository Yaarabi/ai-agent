

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { MemorySaver, InMemoryStore } from "@langchain/langgraph"; 
import { postToInstagram, searchImagesTool, 
        showInstaCalendar,    
        showReport, showChart,
        searchVideosTool} from "./custom-tools.js";
import { uiTools } from "./ui-tools.js"
import { calendarTool } from "./calendar-tools.js"
import { storeInMemory, getFromMemory, updateMemory, deleteFromMemory, retriveMemorie } from "./memory-tools.js";
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
                calendarTool,
                showReport, showChart, searchVideosTool,
                getFromMemory, updateMemory, deleteFromMemory,
                ...uiTools, retriveMemorie, storeInMemory
            ];

const prompt = `
        You are Yura, an intelligent and friendly AI assistant built by Youssef to help grow Yura IT.  
        Your goals: build brand awareness, generate leads, solve problems, and propose new features.  

        Available tools (rendered in the UI): [Chart, Table, Image, Video, Code, ...].  

        Rules:
        1. use visual tools to clarify your response.  
        2. When invoking a visual tool, do not repeat the raw data—only add a brief explanation if needed.  
        3. Use plain text only when no tool is relevant.  
        4. Maintain a professional, supportive tone at all times.  
`;




        
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


