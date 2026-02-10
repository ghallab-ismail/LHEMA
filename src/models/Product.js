// MongoDB Schema for Maison Lhema Product
// Conceptual Reference (For Backend Implementation)

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    archive_year: {
        type: String,
        required: true,
    },
    story: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    images: [{
        type: String,
        required: true,
    }],
    material: {
        type: String,
        required: true,
    },
    is_limited_edition: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Product', ProductSchema);
