import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import packagingImg from '../assets/packagingNew.png';

const Packaging = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            ref={ref}
            className="relative py-24 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #111010 0%, #1a1816 50%, #111010 100%)' }}
        >
            {/* Subtle gold accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative flex justify-center order-1"
                    >
                        {/* Soft warm shadow behind image */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-72 h-72 rounded-full bg-white/5 blur-3xl" />
                        </div>

                        {/* Main image */}
                        <div className="relative rounded-sm overflow-hidden">
                            {/* Gold shimmer border */}
                            <div className="absolute inset-0 border border-white/20 pointer-events-none z-10 rounded-sm" />

                            <motion.img
                                src={packagingImg}
                                alt="Maison Lhema — Coffret cadeau signature"
                                className="relative w-full max-w-sm lg:max-w-md object-cover rounded-sm"
                                initial={{ scale: 0.95 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.03, transition: { duration: 0.8 } }}
                            />
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="order-2 text-center lg:text-left"
                    >
                        {/* Overline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-white/50 text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-sans mb-4"
                        >
                            L'Art de l'Emballage
                        </motion.p>

                        {/* Main heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-100 leading-tight mb-6"
                        >
                            L'Offrande{' '}
                            <span className="text-white/70 italic">Avant</span><br />
                            le Chef-d'Œuvre
                        </motion.h2>

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-16 h-px bg-white/30 mb-6 mx-auto lg:mx-0 origin-left"
                        />

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-stone-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 font-sans"
                        >
                            Avant même que vous la portiez, elle vous appartient déjà.
                            Un coffret noir lacé d'un ruban ivoire frappé du sceau Maison Lhema —
                            chaque livraison est une cérémonie. Parce que ce qui est rare
                            mérite d'être reçu comme un trésor.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            {['Coffret Signature', 'Ruban Ivoire', 'Scellé à la Cire'].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-white/25 text-white/60 rounded-full font-sans hover:border-white/60 hover:text-white transition-colors duration-500 cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </section>
    );
};

export default Packaging;
