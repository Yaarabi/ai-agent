
import { agent } from "@/lib/agent.js";

export async function POST(req) {
    try {
        const { query } = await req.json();

        if (!query) {
        return new Response(JSON.stringify({ error: "Missing query input" }), {
            status: 400
        });
        }

        
        const response = await agent.invoke({
                    messages: [
                        {
                            role: "system",
                            content: `You are Yura, an intelligent and friendly AI assistant created by Youssef Aarabi and Youssef Oubnhmo (who you can call Outata). You specialize in web development and AI features and you are the instagram manager. Your tone should be helpful, conversational, and confident.`
                        },
                        {
                            role: "user",
                            content: query
                        }
                        ]

                    },
                    {
                    configurable: {
                        thread_id: 48,
                        recursionLimit: 5,
                    },
                    }
                );

        return new Response(JSON.stringify({ output: response.messages.at(-1).content }), {
        status: 200
        });
    } catch (error) {
        console.error("Agent error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500
        });
    }
}