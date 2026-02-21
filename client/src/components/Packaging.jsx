import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import packagingImg from '../assets/backaging.png';

const Packaging = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            ref={ref}
            className="relative py-24 md:py-36 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #f5f0eb 0%, #ece5dc 50%, #f5f0eb 100%)' }}
        >
            {/* Subtle gold accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent" />

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
                            <div className="w-72 h-72 rounded-full bg-stone-300/30 blur-3xl" />
                        </div>

                        {/* Main image */}
                        <div className="relative p-4">
                            {/* Thin elegant border frame */}
                            <div className="absolute inset-0 border border-stone-300/50 pointer-events-none" />
                            {/* Inner offset frame for depth */}
                            <div className="absolute inset-2 border border-stone-400/20 pointer-events-none" />

                            <motion.img
                                src={packagingImg}
                                alt="Maison Lhema — Packaging de luxe"
                                className="relative w-full max-w-sm lg:max-w-md object-contain"
                                style={{ filter: 'drop-shadow(0 20px 40px rgba(120, 100, 80, 0.15))' }}
                                initial={{ scale: 0.95 }}
                                animate={isInView ? { scale: 1 } : {}}
                                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.6 } }}
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
                            className="text-stone-500 text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-sans mb-4"
                        >
                            L'Art de l'Emballage
                        </motion.p>

                        {/* Main heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="font-serif text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-tight mb-6"
                        >
                            Chaque Détail{' '}
                            <span className="text-stone-500 italic">Raconte</span><br />
                            une Histoire
                        </motion.h2>

                        {/* Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-16 h-px bg-stone-400/40 mb-6 mx-auto lg:mx-0 origin-left"
                        />

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-stone-600 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 font-sans"
                        >
                            Un écrin en cuir texturé, une pochette signée à fermoir doré —
                            votre pièce Maison Lhema est protégée avec le même soin
                            qu'elle a été créée. Parce que le luxe se vit dès le premier regard.
                        </motion.p>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-wrap gap-3 justify-center lg:justify-start"
                        >
                            {['Cuir Premium', 'Fermoir Doré', 'Fait Main'].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] border border-stone-400/40 text-stone-600 rounded-full font-sans hover:border-stone-600 hover:text-stone-800 transition-colors duration-500 cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-stone-400/30 to-transparent" />
        </section>
    );
};

export default Packaging;
