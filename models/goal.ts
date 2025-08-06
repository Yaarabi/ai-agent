
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    insights: {
        type: [String], 
        required: true,
        default: [],
    },
}, {
    timestamps: true,  
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
