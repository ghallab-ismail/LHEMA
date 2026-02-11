import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import detail1 from '../assets/Gemini_Generated_Image_acqai7acqai7acqa.png';
import detail2 from '../assets/Gemini_Generated_Image_caik0scaik0scaik.png';
import detail3 from '../assets/Gemini_Generated_Image_dfosyqdfosyqdfos.png';
import detail4 from '../assets/Gemini_Generated_Image_za2jslza2jslza2j.png';

const Texture = () => {
    const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
    const [activeImage, setActiveImage] = useState(detail1);
    const imageRef = useRef(null);

    const images = [detail1, detail2, detail3, detail4];

    const handleMouseMove = (e) => {
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Check if within bounds
        if (x < 0 || y < 0 || x > width || y > height) {
            setZoomStyle({ display: 'none' });
            return;
        }

        const posX = (x / width) * 100;
        const posY = (y / height) * 100;

        setZoomStyle({
            display: 'block',
            backgroundImage: `url('${activeImage}')`,
            backgroundPosition: `${posX}% ${posY}%`,
            backgroundSize: '300%', // 3x zoom
            left: `${x - 75}px`, // Center the 150px circle
            top: `${y - 75}px`,
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ display: 'none' });
    };

    return (
        <section className="bg-lhema-cream py-32 md:py-40">
            <div className="mx-auto max-w-4xl px-6">
                <div className="mb-12 text-center text-lhema-black">
                    <h2 className="font-serif text-3xl md:text-4xl">La Silhouette Modeste</h2>
                    <p className="mt-4 font-sans text-xs uppercase tracking-widest text-lhema-black/60">
                        Conçue pour chaque femme. Idéalement adaptée pour le Hijab.
                        <br />
                        <span className="opacity-50">100% Laine Vierge / Doublure Soie</span>
                    </p>
                </div>

                {/* Desktop Magnifier */}
                <div className="hidden md:block">
                    <div
                        className="relative cursor-none overflow-hidden"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img
                            ref={imageRef}
                            src={activeImage}
                            alt="Wool Texture Zoom"
                            className="w-full object-cover"
                        />
                        {/* Magnifying Glass Lens */}
                        <div
                            className="pointer-events-none absolute h-36 w-36 rounded-full border-2 border-lhema-gold shadow-2xl"
                            style={zoomStyle}
                        />
                    </div>
                    {/* Visual Selector */}
                    <div className="mt-8 flex justify-center gap-4">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`h-16 w-16 overflow-hidden border transition-all ${activeImage === img ? 'border-lhema-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img src={img} alt={`Texture ${idx}`} className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Carousel (Simple Horizontal Scroll) */}
                <div className="md:hidden">
                    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                        {images.map((img, i) => (
                            <div key={i} className="min-w-[85vw] snap-center">
                                <img src={img} alt={`Detail ${i + 1}`} className="h-96 w-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-lhema-black/40">
                        Glissez pour examiner
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Texture;
