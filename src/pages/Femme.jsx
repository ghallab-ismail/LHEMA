import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import NoiseOverlay from '../components/NoiseOverlay';
import { products } from '../data/products';
import { motion } from 'framer-motion';

const Femme = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default Femme;
