const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'MAD' },
    category: { type: String, enum: ['femme', 'homme'], required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    stars: { type: Number, default: 5, min: 0, max: 5 },
    stock: { type: Number, default: 10 },
    total_edition: { type: Number, default: 10 },
    is_limited_edition: { type: Boolean, default: true },
    description_title: { type: String, default: '' },
    description_subtitle: { type: String, default: '' },
    features: [FeatureSchema],
    isAvailable: { type: Boolean, default: true },
    hasColors: { type: Boolean, default: false },
    colors: [{
        name: { type: String },
        hex: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
