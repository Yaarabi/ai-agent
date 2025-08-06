import { createAgent } from "@/lib/agent";

export async function POST(req) {
    try {
        const { query } = await req.json();

        if (!query) {
        return new Response(JSON.stringify({ error: "Missing query input" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
        }

        const executor = await createAgent();
        const result = await executor.invoke({ input: query });

        return new Response(JSON.stringify({ output: result.output }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Agent error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
}