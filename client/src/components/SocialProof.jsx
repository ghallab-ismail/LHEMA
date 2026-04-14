import React from 'react';
import { motion } from 'framer-motion';

const SocialProof = () => {
    const partners = [
        { name: "Club Salma d'Équitation", url: "https://www.instagram.com/club_salma_kenitra" },
    ];

    return (
        <section className="bg-lhema-cream py-20 border-t border-lhema-black/5">
            <div className="mx-auto max-w-6xl px-6 text-center">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-lhema-black/40 mb-10">
                    Remerciements
                </p>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center">
                    {partners.map((partner, index) => (
                        <motion.a
                            key={index}
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02, color: 'rgba(0,0,0,0.9)' }}
                            transition={{ 
                                delay: index * 0.1, 
                                duration: 1, 
                                ease: [0.22, 1, 0.36, 1] 
                            }}
                            className="font-serif text-xl md:text-2xl text-lhema-black/70 italic tracking-tight no-underline hover:text-lhema-black transition-colors duration-300"
                        >
                            {partner.name}
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
