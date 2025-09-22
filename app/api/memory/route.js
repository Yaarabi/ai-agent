

import { connectDB } from "@/lib/db.js";
import Memory from "@/models/memory.js";

connectDB()

export async function GET() {
    try {
        const memories = await Memory.find();
        return new Response(JSON.stringify(memories), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch memories' }), { status: 500 });
    }     
}  

export async function POST(request) {
    try {
        const { key, value } = await request.json();
        const newMemory = new Memory({ key, value });
        await newMemory.save();
        return new Response(JSON.stringify(newMemory), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create memory' }), { status: 500 });
    }   
}

export async function PUT(request) {
    try {
        const { id, key, value } = await request.json();
        const updatedMemory = await Memory.findByIdAndUpdate(id, { key, value }, { new: true });
        if (!updatedMemory) {
            return new Response(JSON.stringify({ error: 'Memory not found' }), { status: 404 });
        }   
        return new Response(JSON.stringify(updatedMemory), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update memory' }), { status: 500 });
    }   
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const deletedMemory = await Memory.findByIdAndDelete(id);
        if (!deletedMemory) {
            return new Response(JSON.stringify({ error: 'Memory not found' }), { status: 404 });
        }   
        return new Response(JSON.stringify({ message: 'Memory deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete memory' }), { status: 500 });
    }   
}

