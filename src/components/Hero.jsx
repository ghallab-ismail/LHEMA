import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// import { motion } from 'framer-motion';
import videoBg from '../assets/video-optimized.mp4';
import imageBg from '../assets/imagebackfull.jpeg';

const Hero = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Slow down slightly for luxury feel
            videoRef.current.play().catch(error => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <section className="relative h-[80vh] md:h-screen w-full overflow-hidden bg-lhema-black">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video
                    ref={videoRef}
                    src={videoBg}
                    poster={imageBg}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-black/30" /> {/* Darker overlay for text readability */}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                >
                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-lhema-cream/80 mb-4 md:mb-6">
                        Volume 01 : La Cape Souveraine
                    </p>
                    <h1 className="font-serif text-4xl md:text-7xl text-lhema-cream mb-8 md:mb-12 leading-tight">
                        The Signature Cape:<br className="hidden md:block" /> Effortless Elegance
                    </h1>

                    <button className="hidden md:inline-block border border-lhema-cream/30 px-12 py-4 text-xs uppercase tracking-[0.2em] text-lhema-cream hover:bg-lhema-cream hover:text-lhema-black transition-all duration-500">
                        Reserve My Piece
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
