import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';
import { Sparkles, Crown, Feather, Eye } from 'lucide-react';

const LaMaison = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black overflow-hidden hide-scrollbar">
            <Navbar theme="dark" />
            <NoiseOverlay />

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] opacity-40 pointer-events-none" />

            {/* 1. Hero Title Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center pt-24 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto flex flex-col items-center"
                >
                    <div className="w-[1px] h-24 bg-stone-300 mx-auto mb-12" />
                    
                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-gold mb-8 font-bold">
                        La Maison Lhema
                    </p>
                    
                    <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl tracking-tight text-lhema-black uppercase leading-[1.1] mb-8">
                        Le Manifeste <br className="hidden md:block" />
                        de l'<span className="italic text-lhema-gold">Élégance</span> <br className="hidden md:block" />
                        Silencieuse
                    </h1>

                    <p className="font-serif text-lg md:text-2xl text-lhema-black/50 italic max-w-2xl mt-6">
                        L'essence même de notre existence, gravée dans l'étoffe.
                    </p>
                </motion.div>
                <div className="absolute bottom-0 w-[1px] h-32 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
            </section>

            {/* 2. Notre Philosophie */}
            <section className="relative py-32 md:py-48 px-6 max-w-7xl mx-auto border-t border-stone-200">
                <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
                    {/* Left: The Narrative */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-black/40 mb-8 font-bold flex items-center gap-4">
                                <span className="w-8 h-px bg-lhema-black/20" />
                                L'Essence
                            </p>
                            <h2 className="font-serif text-4xl md:text-6xl text-lhema-black mb-10 leading-[1.1]">
                                Notre <span className="italic text-lhema-gold">Philosophie</span>
                            </h2>
                            
                            <p className="font-sans text-lg md:text-xl text-lhema-black/70 leading-relaxed font-light">
                                "Nous croyons que le véritable luxe <span className="italic font-serif text-2xl text-lhema-black">chuchote</span>. Il ne réside pas dans l'ostentation, mais dans l'art de la discrétion et le respect de la matière. Maison Lhema est née d'une conviction profonde : l'élégance absolue est une alliance intime entre un savoir-faire artisanal méticuleux et des étoffes d'exception, méticuleusement sourcées."
                            </p>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="mt-12 flex gap-6 items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-lhema-black/10">
                                    <Sparkles className="w-5 h-5 text-lhema-gold stroke-[1px]" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-xl text-lhema-black mb-2">L'Artisanat Méticuleux</h4>
                                    <p className="font-sans text-xs text-lhema-black/50 leading-relaxed uppercase tracking-wider">Un respect absolu de la matière.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right: The Visual Statement */}
                    <div className="lg:col-span-5 order-1 lg:order-2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-[3/4] bg-lhema-black overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-4 border border-lhema-cream/10 z-10" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <motion.div style={{ y: y1 }} className="text-white font-serif text-[15vw] md:text-[10vw] leading-none opacity-5 select-none whitespace-nowrap">
                                    PHILOSOPHIE
                                </motion.div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-px h-32 bg-lhema-gold/50" />
                                    <div className="absolute font-serif text-3xl md:text-4xl text-lhema-cream leading-tight">
                                        L'art de la<br />
                                        <span className="italic text-lhema-gold">discrétion</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. L'Exclusivité Absolue */}
            <section className="relative py-32 md:py-48 px-6 bg-[#F8F5F2] overflow-hidden">
                <div className="absolute left-10 top-20 opacity-5 pointer-events-none select-none">
                    <span className="font-serif text-[20vw] text-lhema-black">RARETÉ</span>
                </div>
                
                <div className="relative mx-auto max-w-7xl grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
                    {/* Left: The Visual Statement */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] bg-lhema-black overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-px h-24 bg-lhema-gold/50 mb-8" />
                                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-gold mb-6">
                                        Édition Limitée
                                    </p>
                                    <div className="flex items-center gap-4 text-lhema-cream">
                                        <span className="font-serif text-8xl md:text-9xl">10</span>
                                    </div>
                                    <p className="font-sans text-[8px] uppercase tracking-widest text-lhema-cream/50 mt-6">
                                        Pièces Uniques
                                    </p>
                                </div>
                            </div>
                            
                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, rotate: -10 }}
                                whileInView={{ opacity: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1, duration: 1 }}
                                className="absolute -bottom-8 -right-8 w-32 h-32 md:w-40 md:h-40 bg-lhema-gold rounded-full flex items-center justify-center p-6 text-center shadow-2xl border-4 border-white"
                            >
                                <span className="font-serif text-xs md:text-sm text-lhema-black font-bold uppercase leading-tight tracking-wider">
                                    Refus de<br />la Masse
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right: The Narrative */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-black/40 mb-8 font-bold flex items-baseline gap-4">
                                La Rareté
                                <span className="flex-1 h-px bg-lhema-black/20" />
                            </p>
                            <h2 className="font-serif text-4xl md:text-6xl text-lhema-black mb-10 leading-[1.1]">
                                L'Exclusivité <span className="italic text-lhema-gold">Absolue</span>
                            </h2>
                            
                            <p className="font-sans text-lg md:text-xl text-lhema-black/70 leading-relaxed font-light mb-12">
                                "Nous ne créons pas pour le monde entier. Notre Maison s'adresse exclusivement aux femmes qui exigent la rareté. En limitant rigoureusement nos éditions à 10 pièces uniques, nous refusons la complaisance de la production de masse pour redonner au vêtement son âme, son histoire et son intemporalité."
                            </p>

                            <div className="grid md:grid-cols-2 gap-10 border-t border-lhema-black/10 pt-10">
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                                    <div className="mb-4"><Feather className="w-5 h-5 text-lhema-gold stroke-[1.5px]" /></div>
                                    <h4 className="font-serif text-lg text-lhema-black mb-2">L'Âme du Vêtement</h4>
                                    <p className="font-sans text-[10px] text-lhema-black/50 leading-relaxed uppercase tracking-wider">Chaque création a sa propre histoire.</p>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
                                    <div className="mb-4"><Eye className="w-5 h-5 text-lhema-gold stroke-[1.5px]" /></div>
                                    <h4 className="font-serif text-lg text-lhema-black mb-2">L'Intemporalité</h4>
                                    <p className="font-sans text-[10px] text-lhema-black/50 leading-relaxed uppercase tracking-wider">Loin des tendances éphémères.</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. L'Allure Souveraine */}
            <section className="relative py-32 md:py-48 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
                    {/* Left: The Narrative */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-black/40 mb-8 font-bold flex items-center gap-4">
                                <span className="w-8 h-px bg-lhema-black/20" />
                                La Promesse
                            </p>
                            <h2 className="font-serif text-4xl md:text-6xl text-lhema-black mb-10 leading-[1.1]">
                                L'Allure <span className="italic text-lhema-gold">Souveraine</span>
                            </h2>
                            
                            <p className="font-sans text-lg md:text-xl text-lhema-black/70 leading-relaxed font-light mb-12">
                                "Notre promesse est de vous offrir bien plus qu'une création : une allure souveraine. Acquérir une pièce Maison Lhema, c'est revêtir <span className="italic font-serif text-2xl text-lhema-black">une armure de confiance silencieuse</span>. C'est la certitude de porter une œuvre d'art, pensée et façonnée à la main pour traverser le temps avec une grâce inaltérable."
                            </p>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="inline-flex items-center gap-6 p-6 border border-lhema-black/10"
                            >
                                <div className="w-12 h-12 flex items-center justify-center bg-lhema-black text-lhema-cream rounded-full">
                                    <Crown className="w-5 h-5 stroke-[1px]" />
                                </div>
                                <div>
                                    <p className="font-sans text-[10px] uppercase tracking-widest text-lhema-black/50 mb-1">
                                        Notre Garantie
                                    </p>
                                    <p className="font-serif text-lg text-lhema-black">
                                        Grâce Inaltérable
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right: The Visual Statement */}
                    <div className="lg:col-span-5 order-1 lg:order-2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative aspect-square md:aspect-[3/4] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-lhema-black flex items-center justify-center p-12">
                                <motion.div style={{ y: y2 }} className="text-white font-serif text-[15vw] md:text-[10vw] leading-none opacity-5 select-none whitespace-nowrap">
                                    ALLURE
                                </motion.div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="absolute font-serif text-3xl md:text-5xl text-lhema-cream text-center leading-tight">
                                        <span className="italic">L'Armure</span><br />
                                        de Confiance
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. CTA Section */}
            <section className="relative z-10 py-40 px-6 border-t border-stone-200">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="w-[1px] h-20 bg-lhema-gold/50 mx-auto mb-16" />
                    
                    <p className="font-serif text-2xl md:text-4xl text-stone-600 leading-relaxed mb-16 italic">
                        "Vivez l'expérience de la haute couture, chez vous."
                    </p>
                    
                    <Link
                        to="/essayage-prive"
                        className="inline-block bg-stone-900 text-white min-w-[300px] py-6 px-10 text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium hover:bg-lhema-gold transition-colors duration-500 shadow-2xl shadow-stone-900/10"
                    >
                        Découvrir L'Essayage Privé
                    </Link>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default LaMaison;
