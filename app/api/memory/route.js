import { longTermMemory } from "@/lib/longTermMemory.js";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const query = searchParams.get('query');

        switch (action) {
            case 'retrieve':
                if (!query) {
                    return new Response(JSON.stringify({ error: "Query parameter required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                const memories = await longTermMemory.retrieveMemories(query);
                return new Response(JSON.stringify({ memories }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'stats':
                const stats = await longTermMemory.getMemoryStats();
                return new Response(JSON.stringify({ stats }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'context':
                if (!query) {
                    return new Response(JSON.stringify({ error: "Query parameter required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                const context = await longTermMemory.getConversationContext(query);
                return new Response(JSON.stringify({ context }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            default:
                return new Response(JSON.stringify({ error: "Invalid action" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
        }
    } catch (error) {
        console.error("Memory API error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, content, category, preference, value } = body;

        switch (action) {
            case 'store':
                if (!content) {
                    return new Response(JSON.stringify({ error: "Content required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                const success = await longTermMemory.storeImportantFact(content, category);
                return new Response(JSON.stringify({ success }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'store_preference':
                if (!preference || !value) {
                    return new Response(JSON.stringify({ error: "Preference and value required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                const prefSuccess = await longTermMemory.storeUserPreference(preference, value);
                return new Response(JSON.stringify({ success: prefSuccess }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'add_message':
                if (!content) {
                    return new Response(JSON.stringify({ error: "Content required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                longTermMemory.addToBuffer("user", content);
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'add_ai_response':
                if (!content) {
                    return new Response(JSON.stringify({ error: "Content required" }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                longTermMemory.addToBuffer("assistant", content);
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'summarize':
                const summary = await longTermMemory.summarizeConversation();
                return new Response(JSON.stringify({ summary }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            case 'cleanup':
                const { daysOld = 30 } = body;
                const cleanupSuccess = await longTermMemory.cleanupOldMemories(daysOld);
                return new Response(JSON.stringify({ success: cleanupSuccess }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });

            default:
                return new Response(JSON.stringify({ error: "Invalid action" }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
        }
    } catch (error) {
        console.error("Memory API error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

