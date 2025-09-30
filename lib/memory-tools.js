
import { tool } from '@langchain/core/tools';
import { z } from "zod";
import axios from "axios";
import dotenv from 'dotenv';
import { storeInSupabase, retrieveMatches } from "./rag.js"

dotenv.config();

// export const storeInMemory = tool(
//   async (input) => {
//     try {
//       const { key, value } = JSON.parse(input);
//       const response = await axios.post(`${process.env.URL}/api/memory`, { key, value });
//       return `successfully stored`;
//     }catch (error) {
//         console.error("Error storing in memory:", error);
//         return "Failed to store in memory.";
//     }
//   },
//   {
//     name: "store_memories",
//     description: `Store a key-value pair in memory but check if this memorie don't exist befor. 
//                   Input should be a JSON string with 'key' and 'value'. 
//                   you should use it to store important information that you might need later. And make it short.
//                   don't use "_" in the key write it simple like "Example key".
//                   for the value of the instagram calendar should be an array of days like:
//                   **'[{
//                       day: "",
//                       time: "",
//                       type: "",
//                       content:""
//                       caption:""
//                   }]'**`,
//     inputSchema: z.string().describe('A JSON string with "key" and "value" fields.'),
//   } 
// );

export const storeInMemory = tool(
    async ({ key, value }) => {
        try {
            const success = await storeInSupabase(key, value);
            const memoryDB = await axios.post(`${process.env.URL}/api/memory`, { key })
            return (success && memoryDB) ? '✅ stored' : "❌ Failed to store";
        } catch (error) {
            console.error("Store error:", error);
            return "Error storing.";
        }
    },
    {
        name: "store_memories",
        description: "Store an important memories or piece of information for future reference, with key and value",
        schema: z.object({
          key: z.string().optional().describe("the key of the memorie"),
          value: z.string().describe("The value of the memorie"),
        }),
    }
);

export const retriveMemorie = tool(
  async (query) => {
    try {
      const response = await retrieveMatches(query)
      return response
    }catch (error){
      console.error("Error retrieving :", error);
      return "Failed to retrieve matches.";
    }
  },
  {
    name: "get_matches_memories",
    description: "retrive the memorie mached by passing the key, use 'get_keys' tool to see all the key and choise the needed one",
    inputSchema: z.string().describe('key should be string'),
  }
)

export const getFromMemory = tool(
  async (input) => {
    try {
      const response = await axios.get(`${process.env.URL}/api/memory`);
      // console.log(response.data);
      return JSON.stringify(response.data);
    }catch (error) {
        console.error("Error retrieving from memory:", error);
        return "Failed to retrieve from memory.";
    }
  },
  {
    name: "get_keys",
    description: "Retrieve all key of memories from memory. No input needed. if you need the values use get_matches_memories tool",
    inputSchema: z.string().optional(),
  } 
)

// getFromMemory.invoke();


export const updateMemory = tool(
  async (input) => {
    try { 
      const { id, key } = JSON.parse(input);
      const response = await axios.put(`${process.env.URL}/api/memory`, { id, key });
      return `successfully updated`;
    }catch (error) {
        console.error("Error updating memory:", error);
        return "Failed to update memory.";
    }
  },
  {
    name: "update_memorie_key",
    description: "Update key of a memory entry by its ID. Input should be a JSON string with 'id', 'key'.",
    inputSchema: z.string().describe('A JSON string with "id", "key".'),
  } 
);

export const deleteFromMemory = tool(
  async (input) => {
    try { 
      const { id } = JSON.parse(input);
      const response = await axios.delete(`${process.env.URL}/api/memory`, { data: { id } });
      return `successfully deleted`;
    }catch (error) {
        console.error("Error deleting from memory:", error);
        return "Failed to delete from memory.";
    }
  },
  {
    name: "delete_key",
    description: "Delete a key of a memory entry by its ID. Input should be a JSON string with 'id'.",
    inputSchema: z.string().describe('A JSON string with "id" field.'),
  } 
);
