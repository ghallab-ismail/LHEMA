import React from 'react';
import { motion } from 'framer-motion';

// Placeholders - ideally these would be images of the cape styled differently
// For now using simple div placeholders or imports if available
// Assuming we don't have specific styling images yet, using generic placeholders or existing assets
import style1 from '../assets/Gemini_Generated_Image_acqai7acqai7acqa.png'; // Reusing for now
import style2 from '../assets/Gemini_Generated_Image_caik0scaik0scaik.png';
import style3 from '../assets/Gemini_Generated_Image_dfosyqdfosyqdfos.png';

const StylingGuide = () => {
    const styles = [
        {
            title: "Office Chic",
            description: "Layer over a silk blouse and tailored trousers for commanding elegance.",
            image: style1
        },
        {
            title: "Evening Gala",
            description: "Drape over a floor-length gown to add architectural volume.",
            image: style2
        },
        {
            title: "Weekend Layer",
            description: "Pair with monochrome knitwear for effortless sophisticated comfort.",
            image: style3
        }
    ];

    return (
        <section className="bg-lhema-cream py-32 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="text-center mb-20">
                    <h2 className="font-serif text-3xl md:text-5xl text-lhema-black mb-6">
                        Versatility in Form
                    </h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                        Three Modes of Expression
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {styles.map((style, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="overflow-hidden aspect-[3/4] mb-8">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                                    src={style.image}
                                    alt={style.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <h3 className="font-serif text-2xl mb-3 text-lhema-black">{style.title}</h3>
                            <p className="font-sans text-sm leading-relaxed text-lhema-black/70 max-w-xs">
                                {style.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StylingGuide;
