
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readFile } from 'fs/promises';
import { Mistral } from "@mistralai/mistralai";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const mistalClient = new Mistral(process.env.MISTRAL_API_KEY2);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);



async function splitDocument(path) {
    const text = await readFile(path, 'utf8');
    // console.log(text);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 40
    });
    const output = await splitter.createDocuments([text]);
    const textArray = output.map(doc => doc.pageContent);
    // console.log(textArray);
    return textArray;
}

// splitDocument('./book.txt')
    

// const exampleChunk = "no later than one hour before the start of your scheduled work day.  In the event of an"

const handbookChunks = await splitDocument('./book.txt');

async function createEmbeddings(chunks) {
    const embeddings = await mistalClient.embeddings.create({
        model: 'mistral-embed',
        inputs: chunks
    });
    const data = chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embeddings.data[i].embedding
        }
    });
    // console.log(data)
    return data;
}

// createEmbeddings(handbookChunks)

try {
    const data = await createEmbeddings(handbookChunks);
    await supabase.from('handbook_docs').insert(data)
    .then(() => {
        console.log("Data inserted successfully");
    })
} catch (error) {
    console.log(object.error);
}

