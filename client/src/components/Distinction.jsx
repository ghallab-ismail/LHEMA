import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Eye, Zap, Crown } from 'lucide-react';

const Distinction = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    const traits = [
        {
            icon: Eye,
            title: "Présence Captivante",
            desc: "Une architecture de tissu conçue pour attirer le regard et ne plus jamais le lâcher."
        },
        {
            icon: Zap,
            title: "Énergie Singulière",
            desc: "La confiance absolue de porter ce que personne d'autre dans votre ville ne pourra posséder."
        },
        {
            icon: Crown,
            title: "Autorité Esthétique",
            desc: "Redéfinissez les codes de l'élégance avec une pièce qui impose le respect sans un mot."
        }
    ];

    return (
        <section className="relative bg-lhema-cream py-32 md:py-56 px-6 overflow-hidden">
            {/* Soft decorative grain/texture or light gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] opacity-40 pointer-events-none" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
                    
                    {/* Left Column: The Large Visual Statement */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[3/4] overflow-hidden"
                        >
                            {/* Decorative Frame */}
                            <div className="absolute inset-4 border border-lhema-black/10 z-10" />
                            
                            {/* Inner content - Mocking a sophisticated silhouette focus */}
                            <div className="absolute inset-0 bg-lhema-black flex items-center justify-center p-12">
                                <motion.div 
                                    style={{ y: y1 }}
                                    className="text-white font-serif text-[15vw] md:text-[8vw] leading-none opacity-10 select-none whitespace-nowrap"
                                >
                                    DISTINCTION DISTINCTION
                                </motion.div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1 h-32 bg-lhema-gold/50" />
                                    <div className="absolute font-serif text-3xl md:text-5xl text-lhema-cream text-center leading-tight">
                                        L'Allure<br />
                                        <span className="italic">Proscrite</span><br />
                                        au Nombre
                                    </div>
                                </div>
                                <motion.div 
                                    style={{ y: y2 }}
                                    className="absolute bottom-12 right-12 text-white font-sans text-[8px] uppercase tracking-[0.5em] opacity-30"
                                >
                                    Maison Lhema
                                </motion.div>
                            </div>
                        </motion.div>
                        
                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, rotate: -10 }}
                            whileInView={{ opacity: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute -bottom-8 -right-8 w-32 h-32 md:w-40 md:h-40 bg-lhema-gold rounded-full flex items-center justify-center p-6 text-center shadow-2xl border-4 border-white"
                        >
                            <span className="font-serif text-xs md:text-sm text-lhema-black font-bold uppercase leading-tight tracking-wider">
                                L'Exception<br />Devenue<br />Silhouette
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Column: The Narrative */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-black/40 mb-8 font-bold flex items-center gap-4">
                                <span className="w-8 h-px bg-lhema-black/20" />
                                Le Privilège de l'Identité
                            </p>
                            <h2 className="font-serif text-4xl md:text-7xl text-lhema-black mb-10 leading-[1.1]">
                                Portez ce que les autres ne peuvent pas <span className="italic text-lhema-gold">voir</span>.
                            </h2>
                            
                            <div className="space-y-12">
                                <p className="font-sans text-lg md:text-xl text-lhema-black/70 leading-relaxed max-w-2xl font-light">
                                    Dans un monde saturé de répliques, Maison Lhema vous offre le luxe de ne jamais croiser votre propre image. Notre coupe est une armure de distinction, un signal silencieux que vous appartenez à l'exceptionnel.
                                </p>
                                
                                <div className="grid md:grid-cols-3 gap-10">
                                    {traits.map((trait, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: 0.3 + (index * 0.2) }}
                                        >
                                            <div className="mb-4">
                                                <trait.icon className="w-5 h-5 text-lhema-gold stroke-[1.5px]" />
                                            </div>
                                            <h4 className="font-serif text-lg text-lhema-black mb-2">
                                                {trait.title}
                                            </h4>
                                            <p className="font-sans text-[10px] md:text-xs text-lhema-black/50 leading-relaxed uppercase tracking-wider">
                                                {trait.desc}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="pt-10 border-t border-lhema-black/10 inline-block"
                                >
                                    <p className="font-serif text-xl md:text-2xl italic text-lhema-black/80 max-w-lg">
                                        "Soyez l'un des dix. Celui que l'on n'oublie jamais."
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Distinction;
