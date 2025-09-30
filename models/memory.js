import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, 
    }
});

memorySchema.pre("save", function (next) {
    this.lastUpdated = new Date();
    next();
});

export default mongoose.models.Memory || mongoose.model('Memory', memorySchema);