import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import st1 from '../assets/st1.PNG';
import st2 from '../assets/st2.JPEG';
import st3 from '../assets/st3.JPEG';
import st4 from '../assets/st4.JPEG';
import st5 from '../assets/st5.JPEG';

const images = [st2, st3, st4, st5];

const captions = [
    'La Cape en pleine liberté',
    'Chaque fil, une décision',
    'La soie qui se souvient',
    'Portée comme une seconde peau',
    'Souverain, sans effort',
];

const Texture = () => {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <section className="bg-lhema-cream py-24 md:py-48">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">

                    {/* Text Column - Left */}
                    <div className="order-2 md:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Overline */}
                            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-lhema-black/40 mb-5">
                                l'ensemble souverain — En Mouvement
                            </p>

                            <h2 className="font-serif text-3xl md:text-5xl text-lhema-black mb-6 md:mb-8 leading-tight">
                                Créé pour le Mouvement.<br />
                                <span className="italic text-lhema-black/60">Conçu pour l'Éternité.</span>
                            </h2>

                            <p className="font-sans text-sm md:text-base leading-relaxed text-lhema-black/65 mb-4 max-w-md">
                                L'Ensemble Souverain par Maison Lhema n'a pas été conçu pour rester immobile. Le contraste majestueux entre le Satin Duchesse français et la fluidité du Crêpe de Soie épouse chaque pas avec une grâce innée. Il se porte. Il se vit. Il fascine.
                            </p>

                            <p className="font-sans text-sm md:text-base leading-relaxed text-lhema-black/50 mb-10 max-w-md">
                                Ces images ne sont pas une simple mise en scène. C'est l'essence même de notre création dans son élément naturel — noble, puissante et farouchement libre.
                            </p>

                            <div className="flex gap-8 border-t border-lhema-black/10 pt-8">
                                <div>
                                    <span className="block font-serif text-2xl text-lhema-black">Satin</span>
                                    <span className="text-[10px] uppercase tracking-widest text-lhema-black/40">Duchesse</span>
                                </div>
                                <div>
                                    <span className="block font-serif text-2xl text-lhema-black">10</span>
                                    <span className="text-[10px] uppercase tracking-widest text-lhema-black/40">Pièces Seulement</span>
                                </div>
                                <div>
                                    <span className="block font-serif text-2xl text-lhema-black">01</span>
                                    <span className="text-[10px] uppercase tracking-widest text-lhema-black/40">Volume</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Column - Right (Desktop) */}
                    <div className="hidden md:block order-1 md:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[4/5] overflow-hidden bg-stone-900"
                        >
                            {/* Animated image swap */}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeIdx}
                                    src={images[activeIdx]}
                                    alt={captions[activeIdx]}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </AnimatePresence>

                            {/* Caption overlay */}
                            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/60 to-transparent">
                                <p className="text-white/80 text-[11px] uppercase tracking-[0.25em] font-sans">
                                    {captions[activeIdx]}
                                </p>
                            </div>

                            {/* Dot selectors */}
                            <div className="absolute bottom-5 right-6 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveIdx(idx)}
                                        aria-label={`Image ${idx + 1}`}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIdx === idx
                                            ? 'bg-white scale-125'
                                            : 'bg-white/40 hover:bg-white/70'
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Thumbnail strip */}
                        <div className="flex gap-2 mt-3">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIdx(idx)}
                                    aria-label={`Voir image ${idx + 1}`}
                                    className={`relative flex-1 aspect-square overflow-hidden transition-all duration-300 ${activeIdx === idx ? 'ring-1 ring-lhema-black' : 'opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={captions[idx]}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Carousel */}
                    <div className="md:hidden order-1 w-full overflow-x-scroll snap-x snap-mandatory pb-6 hide-scrollbar flex items-center">
                        <div className="flex gap-4 px-6 w-max">
                            {images.map((img, idx) => (
                                <div key={idx} className="w-[75vw] snap-center relative aspect-[4/5] bg-stone-900 overflow-hidden shadow-sm">
                                    <img
                                        src={img}
                                        alt={captions[idx]}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-white/80 text-[10px] uppercase tracking-widest font-sans">
                                            {captions[idx]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Texture;
