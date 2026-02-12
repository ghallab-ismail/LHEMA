import React from 'react';
import { motion } from 'framer-motion';

const SocialProof = () => {
    const publications = [
        "VOGUE",
        "HARPER'S BAZAAR",
        "L'OFFICIEL",
        "ELLE"
    ];

    return (
        <section className="bg-lhema-cream py-16">
            <div className="mx-auto max-w-6xl px-6 text-center">
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-lhema-black/40 mb-8">
                    Featured In
                </p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center">
                    {publications.map((pub, index) => (
                        <motion.span 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="font-serif text-lg md:text-xl text-lhema-black/60 tracking-widest"
                        >
                            {pub}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
