import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPixel from 'react-facebook-pixel';

const StickyCTA = ({ onReserve }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling past the hero (approx 80vh)
            if (window.scrollY > window.innerHeight * 0.8) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 z-50 w-full bg-lhema-cream border-t border-lhema-black/10 p-4 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                >
                    <button
                        onClick={() => {
                            ReactPixel.track('InitiateCheckout', {
                                content_name: "L'ensemble souverain",
                                content_category: 'Sticky CTA'
                            });
                            onReserve();
                        }}
                        className="w-full bg-lhema-black text-lhema-cream py-4 uppercase tracking-widest text-xs font-sans"
                    >
                        Réserver Votre Pièce
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCTA;
