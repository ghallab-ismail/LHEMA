import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.03 }}
                    transition={{ duration: 2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[40vw] leading-none text-stone-900 font-bold"
                >
                    404
                </motion.div>
            </div>

            {/* Golden decorative line */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-10"
            />

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center relative z-10"
            >
                <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6">
                    Page Introuvable
                </p>

                <h1 className="font-serif text-5xl md:text-7xl text-stone-900 mb-4 leading-tight">
                    Égaré
                </h1>

                <p className="font-sans text-sm md:text-base text-stone-400 max-w-md mx-auto leading-relaxed mb-12">
                    Cette page n'existe pas ou a été déplacée.
                    <br />
                    Laissez-nous vous guider vers notre collection.
                </p>

                <Link to="/">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative inline-flex items-center gap-3 bg-stone-900 text-[#FAF9F6] px-10 py-4 text-xs font-sans uppercase tracking-[0.25em] hover:bg-[#D4AF37] transition-colors duration-500 shadow-xl"
                    >
                        <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Retour à la Maison
                    </motion.button>
                </Link>
            </motion.div>

            {/* Bottom decorative line */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent mt-16"
            />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 font-serif text-[10px] text-stone-300 uppercase tracking-[0.3em]"
            >
                Maison Lhema
            </motion.p>
        </div>
    );
};

export default NotFound;
