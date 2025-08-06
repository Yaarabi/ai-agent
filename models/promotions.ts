
import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    status: {
        type: String,
        enum: ["active", "paused", "ended"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


const Promotion = mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);

export default Promotion;
