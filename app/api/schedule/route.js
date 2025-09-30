

import { testAgent } from "@/lib/agent.js";

export async function GET() {
    try {
        
        
        
        const response = await testAgent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: `check the Yura IT nstagram Calendar and see what relevant with today and post it in instagram.
                                        use image palce of the vedio and reel (still we have in issue with vedios)`
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