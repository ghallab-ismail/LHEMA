import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

const ComingSoon = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black flex flex-col">
            <Navbar />
            <NoiseOverlay />

            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl mb-6">
                        COLLECTION HOMME
                    </h1>
                    <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] opacity-60">
                        Bientôt Disponible
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                    className="w-24 h-[1px] bg-lhema-black/20 mt-12"
                />
            </div>

            <Footer />
        </main>
    );
};

export default ComingSoon;
