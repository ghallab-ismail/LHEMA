const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        default: "The Signature Cape"
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
