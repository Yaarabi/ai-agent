

import { agent } from "@/lib/agent.js";

export async function GET() {
    try {
        
        
        
        const response = await agent.invoke({
                    messages: [
                        {
                            role: "system",
                            content: "Post daily posts on Instagram, to promote Yura IT solutions and to increase the brand awareness and to generate leads."
                        }
                        ]

                    },
                    
                );
        

        return new Response(JSON.stringify({ "success": true }), {
        status: 200
        });
    } catch (error) {
        console.error("Agent error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500
        });
    }
}