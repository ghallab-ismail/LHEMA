import React from 'react';
import { motion } from 'framer-motion';
import imageFront from '../assets/imagefront.jpeg';

const Narrative = () => {
    const narrativeText = [
        "Not designed. Engineered.",
        "Restored from the 1952 Casablanca Archives.",
        "Sculpted from Italian Virgin Wool to command silence."
    ];

    return (
        <section className="relative min-h-[200vh] bg-lhema-cream py-40">
            <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">

                {/* Left: Static Image (Sticky) */}
                <div className="h-[50vh] w-full lg:sticky lg:top-32 lg:h-[80vh] lg:w-1/2 p-8">
                    <div className="h-full w-full overflow-hidden">
                        <img
                            src={imageFront}
                            alt="The Sovereign Cape - Front View"
                            className="h-full w-full object-cover grayscale contrast-125"
                        />
                    </div>
                </div>

                {/* Right: Scrolling Text */}
                <div className="flex w-full flex-col justify-center space-y-40 px-8 py-20 lg:w-1/2 lg:py-0">
                    {narrativeText.map((text, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="flex min-h-[30vh] items-center"
                        >
                            <p className="font-serif text-3xl leading-tight text-lhema-black md:text-5xl lg:text-6xl">
                                {text}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Narrative;
