import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
        default: "Guest User"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "client"
    },
    lastLogin: {
        type: Date,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0.0
    },
    lastOrder: {
        type: Date,
        default: null
    },
}, { timestamps: true })

const Client = mongoose.models.Client || mongoose.model('Client', userSchema);
export default Client;
