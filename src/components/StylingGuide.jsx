import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Placeholders - ideally these would be images of the cape styled differently
// For now using simple div placeholders or imports if available
// Assuming we don't have specific styling images yet, using generic placeholders or existing assets
import style1 from '../assets/Gemini_Generated_Image_acqai7acqai7acqa.png'; // Reusing for now
import style2 from '../assets/Gemini_Generated_Image_caik0scaik0scaik.png';
import style3 from '../assets/Gemini_Generated_Image_dfosyqdfosyqdfos.png';

const StyleCard = ({ style, index }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["center end", "center center"]
    });

    // Grayscale transition: 100% (gray) -> 0% (color) as it scrolls into view
    // Starts gray when entering viewport, becomes colored when centered
    const grayscale = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

    return (
        <div ref={cardRef} className="group cursor-pointer">
            <div className="overflow-hidden aspect-[3/4] mb-8">
                <motion.img
                    style={{ filter: useTransform(grayscale, value => `grayscale(${value})`) }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                    src={style.image}
                    alt={style.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                />
            </div>
            <h3 className="font-serif text-2xl mb-3 text-lhema-black">{style.title}</h3>
            <p className="font-sans text-sm leading-relaxed text-lhema-black/70 max-w-xs">
                {style.description}
            </p>
        </div>
    );
};

const StylingGuide = () => {
    const styles = [
        {
            title: "Bureau Chic",
            description: "Superposez sur un chemisier en soie et un pantalon ajusté pour une élégance imposante.",
            image: style1
        },
        {
            title: "Soirée de Gala",
            description: "Drapez sur une robe longue pour ajouter un volume architectural.",
            image: style2
        },
        {
            title: "Détente Raffinée",
            description: "Associez à une maille monochrome pour un confort sophistiqué sans effort.",
            image: style3
        }
    ];

    return (
        <section className="bg-lhema-cream py-32 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="text-center mb-20">
                    <h2 className="font-serif text-3xl md:text-5xl text-lhema-black mb-6">
                        Polyvalence de la Forme
                    </h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                        Trois Modes d'Expression
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {styles.map((style, index) => (
                        <StyleCard key={index} style={style} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StylingGuide;
