
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        image: { type: String, default: null },
        category: { type: String, default: "General" },
        views: { type: Number, default: 0 },
    },
    { timestamps: true } 
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
