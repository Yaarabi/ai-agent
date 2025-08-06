
import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY2);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// 1. Getting the user input
const input = "December 25th is on a Sunday, do I get any extra time off to account for that?";

// 2. Creating an embedding of the input
const embedding = await createEmbedding(input);

// 3. Retrieving similar embeddings / text chunks (aka "context")
const context = await retrieveMatches(embedding);
// console.log(context)

// 4. Combining the input and the context in a prompt 
// and using the chat API to generate a response 

const response = await generateChatResponse(context, input);
console.log(response);

async function createEmbedding(input) {
    const embeddingResponse = await mistralClient.embeddings.create({
        model: 'mistral-embed',
        inputs: [input]
    });
    return embeddingResponse.data[0].embedding;
}

async function retrieveMatches(embedding) {
    const { data } = await supabase.rpc('match_handbook_docs', {
        query_embedding: embedding,
        match_threshold: 0.78,
        match_count: 5
    });
    const combinedContext = data.map(match => match.content).join('\n\n');
    return combinedContext;
}


async function generateChatResponse(context, query) {
    const chatResponse = await mistralClient.chat.complete({
    model: 'mistral-large-latest',
    messages: [
        {role: 'system', content: `You are an HR assistant. Use the provided context to answer the user\'s query. based on ${context}`},
        {role: 'user', content: query}
    ],
    // temperature: 0.5,
    // response_format: {
    //     type: "json_object"
    // }
    });
    return chatResponse.choices[0].message.content;
}
