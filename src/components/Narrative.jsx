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
        <>
            {/* MOBILE LAYOUT: Immersive Sticky Background */}
            <section className="relative block md:hidden">
                {/* Sticky Background Image */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <img
                        src={imageFront}
                        alt="The Sovereign Cape"
                        className="h-full w-full object-cover grayscale brightness-75"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Scrolling Text Overlay */}
                <div className="relative z-10 -mt-[100vh]">
                    {narrativeText.map((text, index) => (
                        <div key={index} className="flex h-screen items-center justify-center px-8">
                            <motion.p
                                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                viewport={{ margin: "-40%", once: false }} // Re-animates on scroll
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-center font-serif text-3xl font-light leading-snug text-lhema-cream drop-shadow-lg"
                            >
                                {text}
                            </motion.p>
                        </div>
                    ))}
                    {/* Extra padding at bottom to allow full scroll of last item */}
                    <div className="h-[20vh]" />
                </div>
            </section>

            {/* DESKTOP LAYOUT: Split Screen Sticky (Original) */}
            <section className="relative hidden min-h-[200vh] bg-lhema-cream py-40 md:block">
                <div className="mx-auto flex max-w-7xl flex-row">

                    {/* Left: Static Image (Sticky) */}
                    <div className="sticky top-32 h-[80vh] w-1/2 p-8">
                        <div className="h-full w-full overflow-hidden">
                            <img
                                src={imageFront}
                                alt="The Sovereign Cape - Front View"
                                className="h-full w-full object-cover grayscale contrast-125"
                            />
                        </div>
                    </div>

                    {/* Right: Scrolling Text */}
                    <div className="flex w-1/2 flex-col justify-center space-y-40 py-0">
                        {narrativeText.map((text, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="flex min-h-[30vh] items-center px-12"
                            >
                                <p className="font-serif text-5xl leading-tight text-lhema-black lg:text-6xl">
                                    {text}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
};

export default Narrative;
