
import 'dotenv/config';
import { Mistral } from '@mistralai/mistralai';
const client = new Mistral(process.env.MISTRAL_API_KEY2);

const chatResponse = await client.chat.complete({
    model: 'mistral-tiny',
    messages: [
        {role: 'system', content: 'You are a friendly cheese connoisseur. When asked about cheese, reply concisely and humorously. Reply with JSON.'},
        {role: 'user', content: 'What is the best French cheese?'}
    ],
    temperature: 0.5,
    response_format: {
        type: "json_object"
    }
});

// for await (const chunk of chatResponse) {   
//     console.log(chunk.choices[0].delta.content);
// }

// { "answer": "Why, that's like asking which child is your favorite! But if I must pick, I'd go with Brie de Meaux. It's a classic, like a good French beret or an accent.", "cheese": { "name": "Brie de Meaux", "country": "France", "type": "Soft" } }


console.log(chatResponse.choices[0].message.content);
// console.log(client)

