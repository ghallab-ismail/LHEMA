import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Import assets directly
import imageFrontFull from '../assets/imagefrontfull.jpeg';
import imageBackFull from '../assets/imagebackfull.jpeg';
import imageFront from '../assets/imagefront.jpeg';
import imageBack from '../assets/imageback.jpeg';

const Lookbook = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-65%"]);

    const images = [
        { src: imageFrontFull, title: "La Silhouette" },
        { src: imageBackFull, title: "La Structure" },
        { src: imageFront, title: "Le Détail" },
        { src: imageBack, title: "L'Héritage" },
    ];

    return (
        <>
            {/* Mobile Layout: Native Horizontal Snap Scroll */}
            <section className="block md:hidden bg-lhema-cream py-24">
                <div className="mb-12 px-6">
                    <h2 className="font-serif text-3xl text-lhema-black">La Campagne</h2>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-lhema-black/60">
                        Lookbook Hiver 2025
                    </p>
                </div>

                <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-8 px-6 no-scrollbar">
                    {images.map((img, index) => (
                        <div key={index} className="relative h-[60vh] min-w-[85vw] snap-center overflow-hidden">
                            <img
                                src={img.src}
                                alt={img.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-6 left-6 mix-blend-difference">
                                <p className="font-serif text-2xl text-white italic">{img.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-lhema-black/40">
                    Glissez pour explorer
                </p>
            </section>

            {/* Desktop Layout: Sophisticated Sticky Scroll */}
            <section ref={targetRef} className="hidden md:block relative h-[300vh] bg-lhema-cream">
                <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                    <motion.div style={{ x }} className="flex gap-12 pl-12 md:gap-32 md:pl-32">
                        {/* Intro Text Card */}
                        <div className="flex h-[70vh] w-[40vw] flex-col justify-center gap-8 md:w-[25vw]">
                            <h2 className="font-serif text-4xl text-lhema-black md:text-6xl">
                                La Campagne
                            </h2>
                            <p className="font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                                Lookbook Hiver 2025 <br />
                                Capturé à Casablanca
                            </p>
                        </div>

                        {/* Image Cards */}
                        {images.map((img, index) => (
                            <div key={index} className="relative h-[70vh] w-[80vw] shrink-0 overflow-hidden md:w-[45vw]">
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0 hover:scale-105"
                                />
                                <div className="absolute bottom-6 left-6 mix-blend-difference">
                                    <p className="font-serif text-2xl text-white italic">{img.title}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Lookbook;
