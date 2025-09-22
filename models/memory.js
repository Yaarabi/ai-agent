import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, 
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

memorySchema.pre("save", function (next) {
    this.lastUpdated = new Date();
    next();
});

export default mongoose.models.Memory || mongoose.model('Memory', memorySchema);