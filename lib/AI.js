
import { Mistral } from '@mistralai/mistralai';
import { tools } from "./tools.js";
import 'dotenv/config';

const client = new Mistral(process.env.MISTRAL_API_KEY2);

async function agent(query) {
    const messages = [
        { role: "user", content: query }
    ];
        
    const response = await client.chat.complete( {
        model: 'mistral-large-latest',
        messages: messages,
        tools: tools
    });
    
    return response;
}

const response = await agent("Is the transaction T1001 paid?");

console.log(response.choices[0].message);
