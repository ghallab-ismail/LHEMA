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
            className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden bg-lhema-cream"
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
                'top-6 left-6',
                'top-6 right-6',
                'bottom-6 left-6',
                'bottom-6 right-6',
            ].map((pos, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
                    className={`absolute ${pos} w-4 h-4 border-lhema-black/20 pointer-events-none ${i === 0 ? 'border-t border-l' :
                        i === 1 ? 'border-t border-r' :
                            i === 2 ? 'border-b border-l' :
                                'border-b border-r'
                        }`}
                />
            ))}

            {/* Main content wrapper to push footer down */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-20 z-10 relative mt-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col items-center text-center max-w-4xl"
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
                    L'ensemble <br />
                    <span className="italic text-lhema-black/50">Souverain</span>
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
                    Une allure qui exprime ce que les mots ne peuvent traduire
                </motion.p>

                <motion.p
                    variants={fadeUp}
                    className="font-sans text-xs md:text-sm text-lhema-black/35 leading-relaxed max-w-md"
                >
                    L'alliance du Satin Duchesse et du Crêpe de Soie. Coupe sculptée à la main. Confectionné au Maroc, destiné à traverser les générations.
                </motion.p>
                </motion.div>
            </div>

            {/* Bottom elements wrapper */}
            <div className="w-full flex flex-col items-center justify-end pb-14 z-10 relative shrink-0 gap-16">
                {/* ── Scroll CTA ── */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    onClick={onDiscover}
                    className="group flex flex-col items-center gap-2 cursor-pointer border-none bg-transparent"
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
                    className="flex justify-center gap-12 md:gap-20 px-6 w-full"
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
            </div>

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
