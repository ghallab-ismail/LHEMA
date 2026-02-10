import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, default: "The Sovereign Cape" },
    price: { type: Number, default: 2500 },
    stock_remaining: { type: Number, default: 10 },
    waitlist: [{
        name: String,
        phone: String,
        date: { type: Date, default: Date.now },
        city: String
    }]
});

export const Product = mongoose.model('Product', ProductSchema);
