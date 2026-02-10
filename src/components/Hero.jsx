import React from 'react';
import { motion } from 'framer-motion';
import videoBg from '../assets/video.MOV';

const Hero = () => {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-lhema-black">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video
                    src={videoBg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay for text readability */}
            </div>

            {/* Overlay Text */}
            <motion.div
                className="absolute bottom-12 left-0 w-full text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 1.5 }} // Delays until after Loader finishes
            >
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-lhema-cream/90">
                    Volume 01: The Sovereign Cape
                </p>
            </motion.div>
        </section>
    );
};

export default Hero;
