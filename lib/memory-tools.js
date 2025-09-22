
import { tool } from '@langchain/core/tools';
import { z } from "zod";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

export const storeInMemory = tool(
  async (input) => {
    try {
      const { key, value } = JSON.parse(input);
      const response = await axios.post(`${process.env.URL}/api/memory`, { key, value });
      return `successfully stored`;
    }catch (error) {
        console.error("Error storing in memory:", error);
        return "Failed to store in memory.";
    }
  },
  {
    name: "store_memories",
    description: `Store a key-value pair in memory but check if this memorie don't exist befor. 
                  Input should be a JSON string with 'key' and 'value'. 
                  you should use it to store important information that you might need later. And make it short.
                  don't use "_" in the key write it simple like "Example key".
                  for the value of the instagram calendar should be an array of days like:
                  **'[{
                      day: "",
                      time: "",
                      type: "",
                      content:""
                      caption:""
                  }]'**`,
    inputSchema: z.string().describe('A JSON string with "key" and "value" fields.'),
  } 
);

export const getFromMemory = tool(
  async (input) => {
    try {
      const response = await axios.get(`${process.env.URL}/api/memory`);
      console.log(response.data);
      return JSON.stringify(response.data);
    }catch (error) {
        console.error("Error retrieving from memory:", error);
        return "Failed to retrieve from memory.";
    }
  },
  {
    name: "get_memories",
    description: "Retrieve all key-value pairs from memory. No input needed.",
    inputSchema: z.string().optional(),
  } 
)

// getFromMemory.invoke();


export const updateMemory = tool(
  async (input) => {
    try { 
      const { id, key, value } = JSON.parse(input);
      const response = await axios.put(`${process.env.URL}/api/memory`, { id, key, value });
      return `successfully updated`;
    }catch (error) {
        console.error("Error updating memory:", error);
        return "Failed to update memory.";
    }
  },
  {
    name: "update_memories",
    description: "Update a memory entry by its ID. Input should be a JSON string with 'id', 'key', and 'value'. if you want to update a part of the value, re-enter the full value with the changes included. and keep the same format of the value",
    inputSchema: z.string().describe('A JSON string with "id", "key", and "value" fields.'),
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
    name: "delete_memories",
    description: "Delete a memory entry by its ID. Input should be a JSON string with 'id'.",
    inputSchema: z.string().describe('A JSON string with "id" field.'),
  } 
);
