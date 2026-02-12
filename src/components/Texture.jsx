import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import detail1 from '../assets/Gemini_Generated_Image_acqai7acqai7acqa.png';
import detail2 from '../assets/Gemini_Generated_Image_caik0scaik0scaik.png';
import detail3 from '../assets/Gemini_Generated_Image_dfosyqdfosyqdfos.png';
import detail4 from '../assets/Gemini_Generated_Image_za2jslza2jslza2j.png';

const Texture = () => {
    const [activeImage, setActiveImage] = useState(detail1);

    const images = [detail1, detail2, detail3, detail4];

    return (
        <section className="bg-lhema-cream py-24 md:py-48">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">

                    {/* Text Column - Left */}
                    <div className="order-2 md:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="font-serif text-3xl md:text-5xl text-lhema-black mb-6 md:mb-8 leading-tight">
                                100% Virgin Wool.<br />
                                Silk Lining.
                            </h2>
                            <p className="font-sans text-sm md:text-base leading-relaxed text-lhema-black/70 mb-8 max-w-md">
                                Meticulously sourced for unrivaled softness and warmth.
                                The dual-texture composition offers a tactile experience
                                that whispers luxury rather than shouting it.
                            </p>
                            <div className="flex gap-8 border-t border-lhema-black/10 pt-8">
                                <div>
                                    <span className="block font-serif text-2xl text-lhema-black">100%</span>
                                    <span className="text-[10px] uppercase tracking-widest text-lhema-black/50">Natural</span>
                                </div>
                                <div>
                                    <span className="block font-serif text-2xl text-lhema-black">Zero</span>
                                    <span className="text-[10px] uppercase tracking-widest text-lhema-black/50">Synthetic Blend</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Column - Right */}
                    <div className="order-1 md:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[4/5] overflow-hidden bg-gray-100"
                        >
                            <img
                                src={activeImage}
                                alt="Fabric Detail"
                                className="w-full h-full object-cover"
                            />

                            {/* Simple Image Selector Overlay */}
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`w-2 h-2 rounded-full transition-all ${activeImage === img ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Texture;
