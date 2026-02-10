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
        { src: imageFrontFull, title: "The Silhouette" },
        { src: imageBackFull, title: "The Structure" },
        { src: imageFront, title: "The Detail" },
        { src: imageBack, title: "The Heritage" },
    ];

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-lhema-cream">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 pl-12 md:gap-32 md:pl-32">
                    {/* Intro Text Card */}
                    <div className="flex h-[70vh] w-[40vw] flex-col justify-center gap-8 md:w-[25vw]">
                        <h2 className="font-serif text-4xl text-lhema-black md:text-6xl">
                            The Campaign
                        </h2>
                        <p className="font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                            Winter 2025 Lookbook <br />
                            Captured in Casablanca
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
    );
};

export default Lookbook;
