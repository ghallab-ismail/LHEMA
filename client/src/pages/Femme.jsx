import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import NoiseOverlay from '../components/NoiseOverlay';
import { products as staticProducts } from '../data/products';
import { motion } from 'framer-motion';

const Femme = () => {
    // Start with the original static products (they have real images + rich description)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?category=femme`);
                if (response.ok) {
                    const dbProducts = await response.json();
                    // Merge: static products first, then any NEW DB products (skip duplicates by name)
                    const staticNames = staticProducts.map(p => p.name.toLowerCase());
                    const newDbProducts = (Array.isArray(dbProducts) ? dbProducts : []).filter(
                        p => !staticNames.includes(p.name.toLowerCase())
                    );
                    setProducts([...newDbProducts, ...staticProducts]);
                }
            } catch (err) {
                console.error('Error fetching femme products:', err);
                setProducts(staticProducts); // fallback to static only
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-20 max-w-7xl mx-auto min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">COLLECTION FEMME</h1>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] max-w-xl mx-auto opacity-70 leading-relaxed">
                        Élégance intemporelle et silhouettes architecturales.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 opacity-40">
                        <p className="font-serif text-2xl mb-2">Bientôt disponible</p>
                        <p className="font-sans text-xs uppercase tracking-widest">La collection sera disponible prochainement.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {products.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
};

export default Femme;
