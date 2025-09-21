

import { testAgent } from "@/lib/agent.js";

export async function GET() {
    try {
        
        
        
        const response = await testAgent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: "generate a caption and image URL that relevant with the caption, about Yura IT solutions, once you generate that, Post it on instagram"
                        }
                    ]
                    },
                    // { 
                    // configurable: {
                    //         thread_id: "thread-1",
                    //         recursionLimit: 5,
                    //     },
    // }
);
        

        return new Response(JSON.stringify({ success: true }), {
        status: 200
        });
    } catch (error) {
        console.error("Agent error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500
        });
    }
}