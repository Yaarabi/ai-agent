
import mongoose from "mongoose"


const productSchema = new mongoose.Schema({
    name: String,
    title:String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    images: [String],
    ratings: Number,
    createdAt: Date,
    quantity: {
        type:Number,
        default: 1
    },
})

const Product = mongoose.model("Product", productSchema);

export default Product