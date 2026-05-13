import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const StickyCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 z-50 w-full bg-lhema-cream border-t border-lhema-black/10 p-4 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
                >
                    <Link
                        to="/collection"
                        className="block w-full bg-lhema-black text-lhema-cream py-4 uppercase tracking-widest text-xs font-sans text-center"
                    >
                        Découvrir La Collection
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCTA;
