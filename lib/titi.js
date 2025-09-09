import { initializeAgentExecutor } from "langchain/agents";
import { ChatMistralAI } from "@langchain/mistralai";
import { DynamicTool } from "langchain/tools"; 
import { getPaymentDate, getPaymentStatus, postToInstagram } from "./tools.js";

export const tools = [
    new DynamicTool({
        name: "getPaymentStatus",
        description: "Get payment status of a transaction",
        func: async ({ transactionId }) => getPaymentStatus({ transactionId }),
    }),
    new DynamicTool({
        name: "getPaymentDate",
        description: "Get the payment date of a transaction",
        func: async ({ transactionId }) => getPaymentDate({ transactionId }),
    }),
    new DynamicTool({
        name: "postToInstagram",
        description: "Post a photo with caption to Instagram",
        func: async ({ caption }) => await postToInstagram({ caption }),
    }),
];


const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

const executor = await initializeAgentExecutor(
    tools,
    llm,
);

const result = await executor.call({
    input: "when was transaction T1001 paid?",
});

console.log(result.output);
