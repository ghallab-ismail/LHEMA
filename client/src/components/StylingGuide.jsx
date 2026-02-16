import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StyleItem = ({ style, index, isActive, setActive }) => {
    return (
        <motion.div
            onHoverStart={() => setActive(index)}
            onClick={() => setActive(index)}
            className={`border-t border-lhema-black/20 py-8 md:py-12 cursor-pointer transition-colors duration-500 ${isActive ? 'bg-lhema-black/5' : ''}`}
        >
            <div className="flex flex-col md:flex-row justify-between items-baseline md:items-center px-4 md:px-0">
                <h3 className={`font-serif text-3xl md:text-5xl transition-all duration-500 ${isActive ? 'text-lhema-black translate-x-4' : 'text-lhema-black/60'}`}>
                    {style.title}
                </h3>
                <span className={`font-sans text-xs uppercase tracking-widest mt-2 md:mt-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {style.mode}
                </span>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-6 md:pt-8 pl-4 md:pl-12 max-w-2xl">
                            <p className="font-serif italic text-xl md:text-2xl text-lhema-black mb-4">
                                "{style.quote}"
                            </p>
                            <p className="font-sans text-sm md:text-base leading-relaxed text-lhema-black/70">
                                {style.description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const StylingGuide = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const styles = [
        {
            title: "Bureau Chic",
            mode: "Mode I: Structure",
            quote: "L'Armure Douce",
            description: "Superposez sur un chemisier en soie et un pantalon ajusté. La cape structure la silhouette, imposant une élégance de commandement tout en douceur.",
        },
        {
            title: "Soirée de Gala",
            mode: "Mode II: Spectacle",
            quote: "L'Éclat Nocturne",
            description: "Drapez sur une robe longue pour un volume architectural. Le mouvement du tissu crée un drame visuel, transformant chaque entrée en apparition.",
        },
        {
            title: "Détente Raffinée",
            mode: "Mode III: Intimité",
            quote: "Le Cocon Privé",
            description: "Associez à une maille monochrome pour un confort sophistiqué. Une enveloppe de luxe qui transforme les moments de repos en rituels esthétiques.",
        }
    ];

    return (
        <section className="bg-lhema-cream py-32 px-6 overflow-hidden">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-lhema-black mb-6">
                            Polyvalence de la Forme
                        </h2>
                        <p className="font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                            L'Art de la Métamorphose
                        </p>
                    </motion.div>
                </div>

                <div className="border-b border-lhema-black/20">
                    {styles.map((style, index) => (
                        <StyleItem
                            key={index}
                            style={style}
                            index={index}
                            isActive={activeIndex === index}
                            setActive={setActiveIndex}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StylingGuide;
