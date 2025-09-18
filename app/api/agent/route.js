
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
                            role: "user",
                            content: query
                        }
                        ]

                    },
                    {
                    configurable: {
                        thread_id: "thread-1",
                        recursionLimit: 5,
                    },
                    }
                );
        const output = response.messages.at(-1).content;
        const action = response.messages.at(-1).tool;

        if (action){
            return new Response(JSON.stringify({ output, action: action.results?.[0]?.action }), {
                status: 200
            });
        }

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