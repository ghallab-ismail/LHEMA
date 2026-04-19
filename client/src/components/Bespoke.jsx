import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Scissors, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';

const Bespoke = () => {
    const processSteps = [
        {
            icon: Ruler,
            title: "L'Essayage Privé",
            desc: "Notre Maison vient à vous. Une prise de mesures rigoureuse est effectuée lors d'une rencontre privée, avec une précision chirurgicale.."
        },
        {
            icon: PenTool,
            title: "Patron Unique",
            desc: "Nos maîtres artisans dessinent un patron exclusivement pour votre morphologie."
        },
        {
            icon: Scissors,
            title: "Coupe Individuelle",
            desc: "Zéro production de masse. Votre tissu est découpé pièce par pièce, pour vous seul."
        }
    ];

    return (
        <section className="relative bg-[#F8F5F2] py-32 md:py-48 px-6 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-lhema-gold/5 pointer-events-none" />
            <div className="absolute left-10 top-20 opacity-5 pointer-events-none select-none">
                <span className="font-serif text-[20vw] text-lhema-black">ATELIER</span>
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">

                    {/* Left Column: The Craft Visual */}
                    <div className="order-2 lg:order-1 relative">
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
                                    <h3 className="font-serif text-3xl md:text-5xl text-lhema-cream mb-6 italic">
                                        "L'Erreur n'est<br />pas une Option"
                                    </h3>
                                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-gold">
                                        Maison Lhema Studio
                                    </p>
                                    <div className="mt-12 flex items-center gap-4 text-lhema-cream/40">
                                        <span className="font-serif text-6xl">0.0</span>
                                        <span className="font-sans text-[8px] uppercase tracking-widest text-left">
                                            Marge<br />d'Erreur<br />Tolérée
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative measuring tape element mocked with CSS */}
                            <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 md:p-10 shadow-xl border border-stone-100 flex items-center gap-6">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-lhema-black text-white">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-sans text-[10px] uppercase tracking-widest text-stone-400 mb-1">
                                        Fit Garanti
                                    </p>
                                    <p className="font-serif text-lg text-lhema-black">
                                        Perfection Millimétrée
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: The Promise */}
                    <div className="order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-lhema-black/40 mb-8 font-bold">
                                L'Art du Sur-Mesure
                            </p>
                            <h2 className="font-serif text-4xl md:text-7xl text-lhema-black mb-10 leading-tight">
                                Votre <span className="italic">Silhouette</span>,<br />Notre Seul Patron.
                            </h2>

                            <div className="space-y-12">
                                <p className="font-sans text-lg md:text-xl text-lhema-black/70 leading-relaxed max-w-2xl font-light">
                                    Chez Maison Lhema, le prêt-à-porter n'existe pas. Chaque pièce est une création unique, taillée scrupuleusement selon vos propres mesures. Nous ne suivons pas les tailles standard ; nous suivons votre corps.
                                </p>

                                <div className="space-y-8">
                                    {processSteps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: 0.2 * index }}
                                            className="flex gap-6 items-start group"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-lhema-black/10 group-hover:bg-lhema-black group-hover:text-white transition-all duration-500">
                                                <step.icon className="w-5 h-5 stroke-[1px]" />
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-xl text-lhema-black mb-1">
                                                    {step.title}
                                                </h4>
                                                <p className="font-sans text-sm text-lhema-black/50 leading-relaxed">
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="pt-10 flex flex-col gap-6"
                                >
                                    <div className="flex items-center gap-4 text-lhema-black/80">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-lhema-gold border-2 border-white" />
                                            ))}
                                        </div>
                                        <p className="font-sans text-[10px] uppercase tracking-widest">
                                            Approuvé par nos Maîtres Tailleurs
                                        </p>
                                    </div>
                                    <p className="font-serif text-lg italic text-lhema-gold">
                                        "Parce que la perfection commence là où le standard s'arrête."
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

export default Bespoke;
