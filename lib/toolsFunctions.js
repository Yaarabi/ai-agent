
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

import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Define the input schema for the web scraping tool
const webScrapeSchema = z.object({
  url: z.string().url("Invalid URL format"),
  selector: z.string().optional(), // Optional CSS selector for specific data extraction
});

// Define the web scraping tool
const scrapeWebsiteTool = tool(
  {
    name: 'scrape_website',
    description: 'Scrape data from a website by providing a URL and an optional CSS selector.',
    schema: webScrapeSchema,
    func: async ({ url, selector }: { url, selector }) => {
      try {
        // Fetch the HTML content of the webpage
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into Cheerio for parsing
        const $ = cheerio.load(html);

        // If a selector is provided, extract the matching elements
        if (selector) {
          const scrapedData = $(selector).text().trim();
          return scrapedData || "No matching data found for the selector.";
        }

        // If no selector is provided, return the entire HTML
        return html;
      } catch (error) {
        console.error("Error scraping website:", error);
        return "Failed to scrape the website. Check the URL or selector.";
      }
    },
  },
  { returnDirect: true }
);

// Example usage
// const result = await scrapeWebsiteTool.invoke({
//   url: "https://example.com",
//   selector: "h1", // Optional: Extracts all <h1> elements
// });

// console.log(result);