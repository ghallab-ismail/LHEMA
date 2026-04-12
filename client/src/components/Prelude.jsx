import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Stagger container
const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const Prelude = ({ onDiscover }) => {
    const scrollRef = useRef(null);

    return (
        <section
            ref={scrollRef}
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-lhema-cream"
        >
            {/* ── Thin horizontal rule top ── */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="absolute top-0 left-0 right-0 h-px bg-lhema-black/10 origin-left"
            />

            {/* ── Corner marks ── */}
            {[
                'top-8 left-8',
                'top-8 right-8',
                'bottom-8 left-8',
                'bottom-8 right-8',
            ].map((pos, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
                    className={`absolute ${pos} w-4 h-4 border-lhema-black/20 pointer-events-none ${
                        i === 0 ? 'border-t border-l' :
                        i === 1 ? 'border-t border-r' :
                        i === 2 ? 'border-b border-l' :
                                  'border-b border-r'
                    }`}
                />
            ))}

            {/* ── Main content ── */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl"
            >
                {/* Season label */}
                <motion.p
                    variants={fadeIn}
                    className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-lhema-black/35 mb-10"
                >
                    Maison Lhema &nbsp;·&nbsp; Volume I &nbsp;·&nbsp; Édition Limitée
                </motion.p>

                {/* Main headline */}
                <motion.h1
                    variants={fadeUp}
                    className="font-serif text-5xl sm:text-6xl md:text-8xl text-lhema-black leading-[1.05] mb-6"
                >
                    La Cape<br />
                    <span className="italic text-lhema-black/50">Souveraine</span>
                </motion.h1>

                {/* Divider */}
                <motion.div
                    variants={{
                        hidden: { scaleX: 0, opacity: 0 },
                        show: { scaleX: 1, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
                    }}
                    className="w-12 h-px bg-lhema-black/25 my-8 origin-center"
                />

                {/* Manifesto line */}
                <motion.p
                    variants={fadeUp}
                    className="font-sans text-sm md:text-base text-lhema-black/55 leading-relaxed max-w-lg mb-4"
                >
                    Dix pièces. Une seule femme à la fois.
                    Ce que vous portez dit ce que les mots ne peuvent pas.
                </motion.p>

                <motion.p
                    variants={fadeUp}
                    className="font-sans text-xs md:text-sm text-lhema-black/35 leading-relaxed max-w-md mb-14"
                >
                    Satin de soie structuré. Coupe sculptée à la main. Née au Maroc,
                    destinée à traverser les générations.
                </motion.p>
            </motion.div>

            {/* ── Scroll CTA — anchored above stats, no overlap ── */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                onClick={onDiscover}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 group flex flex-col items-center gap-2 cursor-pointer border-none bg-transparent z-10"
                aria-label="Découvrir la collection"
            >
                <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-lhema-black/50 group-hover:text-lhema-black transition-colors duration-500">
                    Découvrir
                </span>
                <motion.span
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="block w-px h-6 bg-lhema-black/25 group-hover:bg-lhema-black/50 transition-colors duration-500 mx-auto"
                />
            </motion.button>

            {/* ── Stats strip bottom ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="absolute bottom-10 left-0 right-0 flex justify-center gap-12 md:gap-20 px-6"
            >
                {[
                    { value: '10', label: 'Pièces au monde' },
                    { value: '100%', label: 'Fait à la main' },
                    { value: '01', label: 'Seule collection' },
                ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                        <span className="block font-serif text-lg md:text-2xl text-lhema-black/80">{value}</span>
                        <span className="block font-sans text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-lhema-black/35 mt-1">{label}</span>
                    </div>
                ))}
            </motion.div>

            {/* ── Bottom rule ── */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-px bg-lhema-black/10 origin-right"
            />
        </section>
    );
};

export default Prelude;
