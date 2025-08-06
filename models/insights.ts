    import mongoose from "mongoose";

    const insightSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    totalRevenue: {
        type: Number,
        required: true,
    },
    avgBasketValue: {
        type: Number,
        required: true,
    },
    paidOrdersCount: {
        type: Number,
        required: true,
    },
    totalOrders: {
        type: Number,
        required: true,
    },
    mostPopularCategory: {
        type: String,
        required: true,
    },
    lowStockProducts: [
        {
        name: String,
        stock: Number,
        },
    ],
    averageRating: {
        type: Number,
        required: true,
    },
    deliveryRate: {
        type: Number,
        required: true,
    },
    ordersToday: {
        type: Number,
        required: true,
    },
    totalCustomers:{
        type: Number,
        required: true,
    },
    bestCustomer: {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client", 
        },
        totalSpent: Number,
        orderCount: Number,
        audience: String,
    },
    audienceDistribution: {
        type: Map,
        of: Number, 
        default: {},
    },
    });

    export default mongoose.models.BusinessInsight ||
    mongoose.model("BusinessInsight", insightSchema);
