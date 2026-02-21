import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

// Importing assets for the gallery
import imageFrontFull from '../assets/imagefrontfull.jpeg';
import imageBackFull from '../assets/imagebackfull.jpeg';
import imageFront from '../assets/imagefront.jpeg';
import imageBack from '../assets/imageback.jpeg';

const Atelier = () => {
    const images = [
        { src: imageFrontFull, caption: "L'Art de la Coupe" },
        { src: imageBackFull, caption: "Structure et Fluidité" },
        { src: imageFront, caption: "Détails Minutieux" },
        { src: imageBack, caption: "L'Essence de la Matière" },
    ];

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-20 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">L'Atelier</h1>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] max-w-xl mx-auto opacity-70 leading-relaxed">
                        Au cœur de la création, où chaque fil raconte une histoire de patience et d'excellence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className={`flex flex-col gap-4 ${index % 2 === 1 ? 'md:mt-32' : ''}`}
                        >
                            <div className="overflow-hidden aspect-[4/5] bg-stone-200">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    src={img.src}
                                    alt={img.caption}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-serif text-xl italic opacity-80">{img.caption}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default Atelier;
