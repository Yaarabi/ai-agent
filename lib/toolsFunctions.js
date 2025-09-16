
import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const mistalClient = new Mistral(process.env.MISTRAL_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);


export async function createEmbeddings(content) {
    const embeddings = await mistalClient.embeddings.create({
        model: 'mistral-embed',
        inputs: [content]
    });
    // console.log(embeddings.data[0].embedding);
    return embeddings.data[0].embedding;
}

// createEmbeddings("Hello world");

export async function storeInSupabase(content) {
    const embedding = await createEmbeddings(content);
    try {
        const { data, error } = await supabase.from('handbook_docs').insert([
            { content, embedding }
        ]);
        // console.log("done");
        if (error) {
            console.error("Supabase Insert Error:", error);
        }   else {
            console.log("Data inserted successfully:");
        }
    } catch (error) {
        console.error("Supabase Error:", error);
    }
}
// storeInSupabase("Yura IT is a company that provide AI solutions for businesses.");

export async function retrieveMatches(content) {
    const embedding = await createEmbeddings(content);
    const { data } = await supabase.rpc('match_handbook_docs', {
        query_embedding: embedding,
        match_threshold: 0.78,
        match_count: 5
    });
    const combinedContext = data.map(match => match.content).join('\n\n');
    console.log(combinedContext);
    return combinedContext;
}
// retrieveMatches("SAAS project to build AI agents.");