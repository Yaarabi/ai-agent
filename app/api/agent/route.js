
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
        const actionMsg = response.messages
                .filter(msg => msg.tool_call_id)
                .at(-1);
        

        let action = null;

        if (actionMsg?.content) {
        try {
            const parsed = JSON.parse(actionMsg.content);
            action = parsed;
        } catch {
            action = actionMsg.content;
        }
        }

        return new Response(JSON.stringify({ output, action }), {
        status: 200
        });
    } catch (error) {
        console.error("Agent error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500
        });
    }
}