/**
 * Seed the Veste-Cape L'Éclat de Lhema product into MongoDB.
 * 
 * Usage:  node seedVesteCape.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if this product already exists (by name)
        const existing = await Product.findOne({ name: "Veste-Cape L'Éclat de Lhema" });
        if (existing) {
            console.log('ℹ️  Product "Veste-Cape L\'Éclat de Lhema" already exists in DB. Updating...');
            await Product.findByIdAndUpdate(existing._id, {
                price: 14500,
                currency: 'MAD',
                category: 'femme',
                images: [
                    'https://i.imgur.com/placeholder1.jpg',
                    'https://i.imgur.com/placeholder2.jpg',
                    'https://i.imgur.com/placeholder3.jpg',
                    'https://i.imgur.com/placeholder4.jpg',
                ],
                sizes: [],
                stars: 5,
                stock: 10,
                total_edition: 10,
                is_limited_edition: true,
                description_title: "L'Élégance Exclusive : Votre Pièce d'Exception",
                description_subtitle: "Découvrez le raffinement absolu avec une création conçue pour vous faire sentir unique.",
                features: [
                    {
                        title: "Le Cachemire Royal",
                        desc: "Un tissu noble, léger et respirant. C'est l'allié parfait pour vous envelopper de douceur et d'élégance tout au long des mois de mars, avril et mai."
                    },
                    {
                        title: "Une Doublure en Satin Prestigieux",
                        desc: "À l'intérieur, un satin d'une fluidité exceptionnelle caresse votre peau pour un confort absolu."
                    },
                    {
                        title: "Des Finitions Artisanales",
                        desc: "Les bordures et les côtés sont minutieusement travaillés à la main. Un détail raffiné qui fait de cette création une véritable pièce rare."
                    },
                    {
                        title: "L'Art de la Couture",
                        desc: "Une pièce qui célèbre le savoir-faire artisanal. L'assemblage est d'une précision mécanique, tandis que les finitions et les détails minutieux sont cousus à la main, dans la plus stricte tradition des ateliers de Haute Couture."
                    }
                ],
                isAvailable: true,
            });
            console.log('✅ Product updated successfully');
        } else {
            const product = new Product({
                name: "Veste-Cape L'Éclat de Lhema",
                description: '',
                price: 580,
                currency: 'MAD',
                category: 'femme',
                images: [
                    'https://i.imgur.com/placeholder1.jpg',
                    'https://i.imgur.com/placeholder2.jpg',
                    'https://i.imgur.com/placeholder3.jpg',
                    'https://i.imgur.com/placeholder4.jpg',
                ],
                sizes: [],
                stars: 5,
                stock: 10,
                total_edition: 10,
                is_limited_edition: true,
                description_title: "L'Élégance Exclusive : Votre Pièce d'Exception",
                description_subtitle: "Découvrez le raffinement absolu avec une création conçue pour vous faire sentir unique.",
                features: [
                    {
                        title: "Le Cachemire Royal",
                        desc: "Un tissu noble, léger et respirant. C'est l'allié parfait pour vous envelopper de douceur et d'élégance tout au long des mois de mars, avril et mai."
                    },
                    {
                        title: "Une Doublure en Satin Prestigieux",
                        desc: "À l'intérieur, un satin d'une fluidité exceptionnelle caresse votre peau pour un confort absolu."
                    },
                    {
                        title: "Des Finitions Artisanales",
                        desc: "Les bordures et les côtés sont minutieusement travaillés à la main. Un détail raffiné qui fait de cette création une véritable pièce rare."
                    },
                    {
                        title: "L'Art de la Couture",
                        desc: "Une pièce qui célèbre le savoir-faire artisanal. L'assemblage est d'une précision mécanique, tandis que les finitions et les détails minutieux sont cousus à la main, dans la plus stricte tradition des ateliers de Haute Couture."
                    }
                ],
                isAvailable: true,
            });

            await product.save();
            console.log('✅ Product "Veste-Cape L\'Éclat de Lhema" seeded successfully!');
            console.log('   ID:', product._id);
        }
    } catch (err) {
        console.error('❌ Error seeding product:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
