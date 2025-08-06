import mongoose, { Schema } from 'mongoose';


    const OrderSchema= new Schema(
    {
        userId: {
        type: String,
        default: "guest"
        },
        name:String,
        email:String,
        items: [
        {
            productId: {
            type: String,
            required: true,
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
        ],
        shippingAddress: {
        city: { type: String, required: true },
        country: { type: String, required: true },
        },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true, 
    }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
