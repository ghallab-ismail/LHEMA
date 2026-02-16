import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 1000); // Allow exit animation to finish before unmounting/unlocking scroll
        }, 3500); // 3s text fade + 0.5s pause

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-lhema-cream"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1] } // Custom easing for "curtain" feel
                    }}
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            className="font-serif text-3xl md:text-5xl tracking-widest text-lhema-black"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        >
                            MAISON LHEMA
                        </motion.h1>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Loader;
