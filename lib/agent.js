

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
// import { pull } from "langchain/hub";
import { MemorySaver } from "@langchain/langgraph";
import { weatherTool, calculator_tool, postToInstagram } from "./custom-tools.js";
import dotenv from 'dotenv';

dotenv.config();

const memory = new MemorySaver()

        
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
        memory,
        verbose: true,
        });

    // const response = await agent.invoke({
    //         messages: [{ 
    //             role: "user", 
    //             content: "post in instagram in Arabic about Yura IT solutons tha provide AI features for websites specialy the webstores and e-commerce." 
    //         }],
    //         },
    //         {
    //         configurable: {
    //             thread_id: 48,
    //             recursionLimit: 5,
    //         },
    //         }
    //     );

        // console.log(response.messages.at(-1).content);





