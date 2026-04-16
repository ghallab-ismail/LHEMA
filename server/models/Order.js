const mongoose = require('mongoose');

const CraftingStepSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titleAr: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    completedAt: {
        type: Date,
        default: null
    }
}, { _id: true });

const OrderSchema = new mongoose.Schema({
    trackingCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    customerName: {
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
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
        required: true
    },
    status: {
        type: String,
        enum: ['received', 'in-progress', 'ready', 'shipped', 'delivered'],
        default: 'received'
    },
    craftingSteps: {
        type: [CraftingStepSchema],
        default: [
            { title: 'Demande Reçue', description: 'Votre commande a été enregistrée et confirmée.', status: 'completed', completedAt: new Date() },
            { title: 'Sélection des Tissus', description: 'Nos artisans sélectionnent les plus beaux tissus pour votre pièce.', status: 'pending' },
            { title: 'Patron & Coupe', description: 'Le patron est créé sur mesure et les tissus sont découpés avec précision.', status: 'pending' },
            { title: 'Confection Artisanale', description: 'Votre pièce est cousue à la main par nos maîtres artisans.', status: 'pending' },
            { title: 'Finitions & Détails', description: 'Les broderies, boutons et finitions de luxe sont ajoutés.', status: 'pending' },
            { title: 'Contrôle Qualité', description: 'Chaque détail est inspecté pour garantir la perfection.', status: 'pending' },
            { title: 'Emballage Premium', description: 'Votre pièce est soigneusement emballée dans notre packaging signature.', status: 'pending' },
            { title: 'Expédition', description: 'Votre commande est en route vers vous.', status: 'pending' }
        ]
    },
    estimatedDelivery: {
        type: Date,
        default: null
    },
    adminNotes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    customerReview: {
        type: String,
        default: ''
    },
    customerRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewDate: {
        type: Date,
        default: null
    },
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry'
    }
});

// Generate a unique tracking code: LH-XXXXXX
OrderSchema.statics.generateTrackingCode = async function () {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (O, 0, I, 1)
    let code;
    let exists = true;

    while (exists) {
        let random = '';
        for (let i = 0; i < 6; i++) {
            random += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = `LH-${random}`;
        exists = await this.findOne({ trackingCode: code });
    }

    return code;
};

module.exports = mongoose.model('Order', OrderSchema);
