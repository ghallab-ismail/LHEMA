import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import CheckoutModal from '../components/CheckoutModal';
import { products } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id) || p.id === id);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const hasAutoOpened = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show sticky button after scrolling a bit
            if (window.scrollY > 400) {
                setShowStickyButton(true);
            } else {
                setShowStickyButton(false);
            }

            // Auto-open modal when reaching the bottom of the page
            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
            if (isAtBottom && !hasAutoOpened.current) {
                setIsModalOpen(true);
                hasAutoOpened.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            // Swipe left (next image)
            setActiveImage((prev) => (prev + 1) % product.images.length);
        } else if (info.offset.x > swipeThreshold) {
            // Swipe right (previous image)
            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    };


    if (!product) return <div className="text-white">Product not found</div>;

    return (
        <div className="bg-[#FAF9F6] min-h-screen text-stone-900 font-sans pb-24 lg:pb-0 relative">
            {/* The Navbar needs to be absolute or sticky so content goes under it/starts below it properly,
                in the original code it's fixed. Let's make sure it has z-index and the content pushes down slightly. */}
            <div className="relative z-50">
                <Navbar theme="dark" />
            </div>

            <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Sticky Image Gallery */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden relative group bg-[#FAF9F6]">
                    <Link to="/" className="absolute top-[80px] left-6 z-20 mix-blend-difference text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    {/* Desktop View: Static Image List or Fading Images */}
                    <div className="hidden lg:block h-full w-full pt-[80px]">
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mobile View: Swipeable Carousel */}
                    <div className="lg:hidden w-full h-[65vh] pt-[60px] relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.img
                                key={activeImage}
                                src={product.images[activeImage]}
                                alt={product.name}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover absolute top-0 left-0 pt-[60px] cursor-grab active:cursor-grabbing"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Image Navigation Dots (Overlay) */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {product.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Scrollable Details */}
                <div className="w-full lg:w-1/2 px-6 py-10 lg:px-20 lg:py-24 flex flex-col pt-24 lg:pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-xl mx-auto w-full"
                    >
                        <div className="mb-6">
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-3 leading-tight">{product.name}</h1>

                            {/* Premium Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1} />
                                ))}
                                <span className="text-xs font-serif text-stone-500 ml-2">(Édition Limitée)</span>
                            </div>

                            <div className="flex items-center gap-4 mb-2">
                                <p className="font-serif text-2xl text-stone-900 font-medium">
                                    {product.price.toLocaleString()} {product.currency || 'DH'}
                                </p>
                                {product.stock > 0 && (
                                    <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                                        En Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Limited Edition Card */}
                        {product.is_limited_edition && (
                            <div className="border border-[#D4AF37]/40 bg-[#FFFDF9] p-6 lg:p-8 mb-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
                                <div className="text-center mb-6">
                                    <h3 className="font-serif text-lg md:text-xl text-stone-900 mb-1">Collection Privée : Pièce numérotée</h3>
                                    <p className="font-sans text-sm text-stone-500">(1 sur {product.total_edition || 10} au Maroc)</p>
                                </div>

                                <div className="flex justify-center gap-2 md:gap-3 mb-5">
                                    {Array.from({ length: product.total_edition || 10 }).map((_, i) => {
                                        const total = product.total_edition || 10;
                                        const available = product.stock;
                                        const sold = total - available;
                                        const isSold = i < sold;
                                        return (
                                            <div
                                                key={i}
                                                className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full ${isSold ? 'bg-stone-300' : 'bg-[#2C2C2C] shadow-md'} transition-all`}
                                            />
                                        )
                                    })}
                                </div>
                                <p className="text-center font-sans text-sm text-stone-600">
                                    Pièces restantes : <span className="text-[#D4AF37] font-semibold text-base">{product.stock}</span> <span className="opacity-50">/ {product.total_edition || 10}</span>
                                </p>
                            </div>
                        )}

                        {/* Description & Features */}
                        <div className="mb-12">
                            <h2 className="font-serif text-xl border-b border-stone-200 pb-4 mb-8">Savoir-Faire & Composition</h2>

                            {product.description_title && (
                                <div className="mb-8">
                                    <h4 className="font-serif text-lg mb-3 text-stone-900">{product.description_title}</h4>
                                    <p className="text-stone-600 text-sm leading-relaxed">{product.description_subtitle}</p>
                                </div>
                            )}

                            {product.features && (
                                <ul className="space-y-6">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start group">
                                            <span className="mr-4 text-[#D4AF37] mt-1 text-lg leading-none">•</span>
                                            <div>
                                                <strong className="text-stone-900 font-medium block mb-1">{feature.title}</strong>
                                                <span className="text-stone-600 text-sm leading-relaxed block">{feature.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        {/* Action Button Removed - Using only Sticky CTA */}

                    </motion.div>
                </div>
            </div>

            {/* Sticky Floating CTA */}
            <AnimatePresence>
                {showStickyButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 bg-white/90 backdrop-blur-md border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 flex justify-between items-center"
                    >
                        <div className="hidden md:block">
                            <h4 className="font-serif text-lg text-stone-900">{product.name}</h4>
                            <p className="font-serif text-sm text-stone-500">{product.price.toLocaleString()} {product.currency || 'DH'}</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full md:w-auto bg-[#1A1A1A] text-white py-4 px-10 text-xs tracking-[0.2em] font-medium uppercase hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl"
                        >
                            Demander l'acquisition
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;
