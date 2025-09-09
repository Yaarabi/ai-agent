
import { Mistral } from '@mistralai/mistralai';
import { tools, getPaymentDate, getPaymentStatus, postToInstagram } from "./tools.js";
import "dotenv/config.js";


const client = new Mistral(process.env.MISTRAL_API_KEY2);

const availableFunctions = {
    getPaymentDate,
    getPaymentStatus,
    postToInstagram
};

export async function agent(query) {
    const messages = [
        { role: "user", content: query }
    ];
    
    // Challenge:
    // Create a for loop that runs a maximum of 5 times
    
    for (let i = 0; i < 5; i++) {
        const response = await client.chat.complete( {
            model: 'mistral-large-latest',
            messages,
            tools
        });
        
        messages.push(response.choices[0].message);

        // if the finishReason is 'stop', then simply return the 
        // response from the assistant
        if (response.choices[0].finishReason === 'stop') {
            return response.choices[0].message.content;
        } else if (response.choices[0].finishReason === 'tool_calls') {

            const functionObject = response.choices[0].message.toolCalls[0].function;
            const functionName = functionObject.name;
            const functionArgs = JSON.parse(functionObject.arguments);
            const functionResponse = await availableFunctions[functionName](functionArgs);

                messages.push({
                    role: 'tool',
                    toolCallId: response.choices[0].message.toolCalls[0].id,
                    content: functionResponse
                });
            // return functionResponse

        }
    }
}

const response = await agent("Generate and post to Instagram a caption for an IT company photo with a futuristic building.")

console.log(response);

// const response = await client.chat.complete( {
//             model: 'mistral-large-latest',
//             messages:"hello, how are you?",
//             tools
//         });

// console.log(response.choices[0].message);