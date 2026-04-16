import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivateFitting = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            {/* 1. Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="w-[1px] h-24 bg-stone-300 mx-auto mb-12" />
                    <h1 className="font-serif text-3xl md:text-6xl mb-8 tracking-[0.15em] text-stone-900 uppercase">L'Essayage Privé</h1>
                    <h2 className="font-serif text-lg md:text-2xl mb-12 text-stone-600 italic tracking-wide">
                        L'excellence du sur-mesure, dans l'intimité de votre intérieur.
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-stone-500 leading-[2em] max-w-2xl mx-auto tracking-widest uppercase">
                        L'élégance absolue réside dans les détails et l'ajustement parfait. Parce que nos créations sont éditées en série très limitée, nous vous offrons une expérience d'acquisition intimiste et exclusive. Laissez notre Maison venir à vous.
                    </p>
                </motion.div>
                <div className="absolute bottom-0 w-[1px] h-32 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
            </section>

            {/* 2. Le Rituel Section */}
            <section className="py-40 px-6 max-w-6xl mx-auto">
                <div className="space-y-32 md:space-y-48">
                    {[
                        {
                            num: "01",
                            title: "L'EXCLUSIVITÉ",
                            text: "Notre équipe se déplace au lieu de votre choix pour vous présenter la pièce en toute confidentialité et vous faire découvrir la noblesse de nos étoffes à travers nos échantillons privés."
                        },
                        {
                            num: "02",
                            title: "LA PRÉCISION",
                            text: "Une prise de mesures rigoureuse est effectuée sur place par nos soins, garantissant un tombé irréprochable et une silhouette sublimée, pensée uniquement pour vous."
                        },
                        {
                            num: "03",
                            title: "LA CRÉATION",
                            text: "Lors de cette rencontre, nous validons ensemble la mise en confection de votre pièce unique. Votre ensemble sera ensuite façonné à la main dans notre atelier, avant de vous être remis."
                        }
                    ].map((step, idx) => {
                        const isEven = idx % 2 === 1;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Immersive background number */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[12rem] md:text-[24rem] text-stone-800 opacity-[0.03] select-none pointer-events-none">
                                    {step.num}
                                </div>
                                
                                <div className="flex-1 text-center md:text-left z-10 md:px-12">
                                    <div className={`flex items-center gap-6 mb-8 justify-center md:justify-start ${isEven ? 'md:flex-row-reverse md:text-right' : ''}`}>
                                        <span className="font-serif text-3xl md:text-4xl text-stone-400 italic">{step.num}.</span>
                                        <div className="h-[1px] w-16 bg-stone-300" />
                                    </div>
                                    <h3 className={`font-sans text-[11px] md:text-[12px] font-bold uppercase tracking-[0.4em] text-stone-900 mb-8 block ${isEven ? 'md:text-right' : ''}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`font-serif text-lg md:text-xl text-stone-600 leading-[1.8] tracking-wide italic ${isEven ? 'md:text-right' : ''}`}>
                                        "{step.text}"
                                    </p>
                                </div>
                                <div className="flex-1 hidden md:block" /> {/* Spacer for stagger effect */}
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* 3. CTA Section */}
            <section className="py-40 px-6 border-t border-stone-100/50">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="w-[1px] h-16 bg-stone-300 mx-auto mb-12" />
                    
                    <h3 className="font-serif text-3xl md:text-5xl mb-8 text-stone-900 uppercase tracking-[0.1em]">
                        Acquérir l'Exception
                    </h3>
                    
                    <p className="font-serif text-lg md:text-xl text-stone-600 leading-relaxed mb-16 italic px-4">
                        L'essayage privé vous sera proposé lors de la réservation de votre pièce, pour finaliser votre expérience sur-mesure.
                    </p>
                    
                    <Link
                        to="/collection"
                        className="inline-block bg-stone-900 text-white min-w-[280px] py-6 px-12 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium hover:bg-stone-500 transition-colors duration-500 shadow-xl shadow-stone-900/10"
                    >
                        Découvrir la Collection
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default PrivateFitting;
