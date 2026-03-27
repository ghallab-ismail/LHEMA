import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Gem, Users, Lock, Award, Star } from 'lucide-react';

const Exclusivity = () => {
    const pillars = [
        {
            icon: ShieldCheck,
            title: "Authenticité Garantie",
            desc: "Chaque pièce est accompagnée d'un certificat d'authenticité et d'un numéro de série unique."
        },
        {
            icon: Gem,
            title: "Rare par Nature",
            desc: "Nous utilisons des tissus d'exception dont le stock est limité, rendant chaque pièce irremplaçable."
        },
        {
            icon: Users,
            title: "Cercle Privé",
            desc: "En acquérant une pièce Lhema, vous rejoignez une communauté restreinte de connaisseurs."
        }
    ];

    const slots = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <section className="relative bg-[#0A0A0A] py-32 md:py-48 px-6 overflow-hidden border-y border-white/5">
            {/* Background Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                <span className="font-serif text-[40vw] leading-none text-white select-none translate-y-20">10</span>
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="flex flex-col items-center text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.5em] text-lhema-gold mb-8 font-bold">
                            Le Manifeste de la Rareté
                        </p>
                        <h2 className="font-serif text-5xl md:text-8xl text-lhema-cream mb-10 leading-none">
                            L'Édition des <span className="italic text-lhema-gold">Dix</span>
                        </h2>
                        <div className="h-px w-24 bg-lhema-gold mx-auto mb-10" />
                        <p className="font-sans text-lg md:text-2xl text-lhema-cream/60 leading-relaxed max-w-3xl mx-auto font-light">
                            Chez Maison Lhema, nous ne créons pas pour tous. Chaque modèle est scrupuleusement limité à 10 exemplaires numérotés dans le monde entier.
                        </p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-stretch">
                    {/* Left Column: Visual Slots */}
                    <div className="flex flex-col justify-center">
                        <div className="grid grid-cols-5 gap-3 md:gap-4 mb-12">
                            {slots.map((slot) => (
                                <motion.div
                                    key={slot}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.05 * slot }}
                                    className="aspect-square border border-white/10 flex items-center justify-center relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-lhema-gold/5 group-hover:bg-lhema-gold/10 transition-colors duration-500" />
                                    <span className="font-serif text-xl md:text-2xl text-lhema-cream/40 group-hover:text-lhema-gold transition-colors duration-500">
                                        {slot.toString().padStart(2, '0')}
                                    </span>
                                    {slot === 1 && (
                                        <div className="absolute top-0 right-0 p-1">
                                            <Star className="w-2 h-2 text-lhema-gold fill-lhema-gold" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="bg-lhema-gold/5 border-l border-lhema-gold p-8 md:p-10 backdrop-blur-sm"
                        >
                            <h3 className="font-serif text-2xl md:text-3xl text-lhema-cream mb-4 italic">
                                "Une promesse, aucune réédition."
                            </h3>
                            <p className="font-sans text-sm md:text-base text-lhema-cream/60 leading-relaxed">
                                Une fois le 10ème exemplaire acquis, le patron est archivé, les tissus restants sont détruits ou recyclés. Votre pièce devient instantanément un objet de collection.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Pillars of Exclusivity */}
                    <div className="flex flex-col justify-between space-y-8 md:space-y-0">
                        <div className="space-y-8">
                            {pillars.map((pillar, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 * index }}
                                    className="group bg-white/[0.02] border border-white/5 p-8 md:p-10 hover:bg-white/[0.04] hover:border-lhema-gold/30 transition-all duration-700"
                                >
                                    <div className="flex gap-8 items-start">
                                        <div className="p-4 bg-lhema-gold/10 rounded-full group-hover:bg-lhema-gold/20 transition-all duration-700">
                                            <pillar.icon className="w-6 h-6 text-lhema-gold stroke-[1.5px]" />
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-2xl text-lhema-cream mb-4">
                                                {pillar.title}
                                            </h4>
                                            <p className="font-sans text-sm md:text-base text-lhema-cream/40 leading-relaxed group-hover:text-lhema-cream/70 transition-colors duration-700">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Acquisition Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1 }}
                            className="flex items-center gap-6 py-10 border-t border-white/10 mt-12 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
                        >
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-lhema-gold/20">
                                <Lock className="w-5 h-5 text-lhema-gold" />
                            </div>
                            <div>
                                <p className="font-sans text-xs uppercase tracking-[0.3em] text-lhema-gold font-bold mb-1">
                                    Privilège d'Acquisition
                                </p>
                                <p className="font-sans text-sm text-lhema-cream/50">
                                    L'achat ne garantit pas la possession. Chaque demande est soumise à approbation.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Exclusivity;
