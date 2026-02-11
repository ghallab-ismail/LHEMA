import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import imageFront from '../assets/imagefront.jpeg';

const Narrative = () => {
    const mobileContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: mobileContainerRef,
        offset: ["start start", "end end"]
    });

    // Adjusted timings for "The Long Read":
    // 1. Height is now 600vh.
    // 2. Text 3 fades in at 70% and holds until 100%. (30% of 600vh = 180vh of visibility).
    const opacity1 = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.75, 0.85, 1, 1], [0, 1, 1, 1]); // Long hold

    const narrativeText = [
        "Not designed. Engineered.",
        "Restored from the 1952 Casablanca Archives.",
        "Sculpted from Italian Virgin Wool."
    ];

    return (
        <>
            {/* MOBILE LAYOUT: Scroll-Jacked / Pinned Narrative */}
            <section ref={mobileContainerRef} className="relative block h-[600vh] md:hidden">
                <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                    {/* Background Image (Darkened) */}
                    <img
                        src={imageFront}
                        alt="The Sovereign Cape"
                        className="absolute inset-0 h-full w-full object-cover grayscale brightness-[0.4]"
                    />

                    {/* Text Container - Centered & Pinned */}
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center">

                        {/* Text 1 */}
                        <motion.p
                            style={{ opacity: opacity1 }}
                            className="absolute font-serif text-3xl font-light leading-snug text-lhema-cream drop-shadow-md"
                        >
                            {narrativeText[0]}
                        </motion.p>

                        {/* Text 2 */}
                        <motion.p
                            style={{ opacity: opacity2 }}
                            className="absolute font-serif text-3xl font-light leading-snug text-lhema-cream drop-shadow-md"
                        >
                            {narrativeText[1]}
                        </motion.p>

                        {/* Text 3 */}
                        <motion.p
                            style={{ opacity: opacity3 }}
                            className="absolute font-serif text-3xl font-light leading-snug text-lhema-cream drop-shadow-md"
                        >
                            {narrativeText[2]}
                        </motion.p>

                    </div>

                    {/* Progress Indicator (Optional Luxury Touch) */}
                    <div className="absolute bottom-8 left-1/2 h-1 w-24 -translate-x-1/2 overflow-hidden rounded-full bg-white/20">
                        <motion.div
                            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                            className="h-full w-full bg-lhema-gold"
                        />
                    </div>
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
