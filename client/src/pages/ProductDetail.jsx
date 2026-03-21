import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import CheckoutModal from '../components/CheckoutModal';
import { products as staticProducts } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const hasAutoOpened = useRef(false);

    // Wake up the Render backend immediately when user lands on the product page
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => { });
    }, []);

    // Load product: try static first, then API
    useEffect(() => {
        const staticProduct = staticProducts.find(p => p.id === parseInt(id) || p.id === id);
        if (staticProduct) {
            setProduct(staticProduct);
            setProductLoading(false);
            return;
        }
        // Fetch from API (DB product by _id)
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setProductLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const fetchCompletedCount = async () => {
            try {
                // Fetch by product.id or product._id (for DB products)
                const pid = product.id || product._id;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/completed-count?productId=${encodeURIComponent(pid)}&productName=${encodeURIComponent(product.name)}`);
                if (response.ok) {
                    const data = await response.json();
                    setCompletedCount(data.count || 0);
                }
            } catch (err) {
                console.error('Error fetching completed inquiries count:', err);
            }
        };

        fetchCompletedCount();
    }, [product]);

    const dynamicStock = product ? Math.max(0, product.total_edition - completedCount) : 0;
    // Product is purchasable only if isAvailable is true AND there is stock
    const isProductAvailable = product ? (product.isAvailable !== false && dynamicStock > 0) : false;

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

    if (productLoading) return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-stone-600">
            <p className="font-serif text-2xl mb-2">Produit introuvable</p>
            <a href="/" className="text-xs uppercase tracking-widest underline mt-4">Retour à l'accueil</a>
        </div>
    );

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
                                    <Star key={i} className={`w-4 h-4 ${i < (product.stars !== undefined ? product.stars : 5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'}`} strokeWidth={1} />
                                ))}
                                {product.is_limited_edition && <span className="text-xs font-serif text-stone-500 ml-2">(Édition Limitée)</span>}
                            </div>

                            <div className="flex items-center gap-4 mb-2">
                                <p className="font-serif text-2xl text-stone-900 font-medium">
                                    {product.price.toLocaleString()} {product.currency || 'DH'}
                                </p>
                                {product.isAvailable === false ? (
                                    <span className="bg-stone-200/80 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                                        Indisponible
                                    </span>
                                ) : dynamicStock > 0 ? (
                                    <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                                        En Stock
                                    </span>
                                ) : (
                                    <span className="bg-red-100/80 text-red-800 text-[10px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-widest">
                                        Rupture de stock
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
                                        const available = dynamicStock;
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
                                    Pièces restantes : <span className="text-[#D4AF37] font-semibold text-base">{dynamicStock}</span> <span className="opacity-50">/ {product.total_edition || 10}</span>
                                </p>
                            </div>
                        )}

                        {/* Description & Features */}
                        <div className="mb-12 mt-16">
                            <div className="text-center mb-10">
                                <h2 className="font-serif text-2xl lg:text-3xl text-stone-900 tracking-wide mb-4">Savoir-Faire & Composition</h2>
                                <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto"></div>
                            </div>

                            {product.description_title && (
                                <div className="mb-10 text-center">
                                    <h4 className="font-serif text-xl lg:text-2xl mb-4 text-stone-800 leading-snug">{product.description_title}</h4>
                                    <p className="text-stone-500 font-sans text-sm md:text-base leading-relaxed max-w-md mx-auto italic">
                                        "{product.description_subtitle}"
                                    </p>
                                </div>
                            )}

                            {product.features && (
                                <div className="bg-white p-6 lg:p-8 border border-stone-100 shadow-sm mt-8">
                                    <ul className="space-y-6">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex flex-col gap-1 border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                                                <strong className="text-stone-900 font-serif text-[15px] block uppercase tracking-wider">{feature.title}</strong>
                                                <span className="text-stone-600 font-sans text-sm leading-relaxed block">{feature.desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
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
                            disabled={!isProductAvailable}
                            className={`w-full md:w-auto py-4 px-10 text-xs tracking-[0.2em] font-medium uppercase transition-all duration-300 shadow-xl ${isProductAvailable
                                ? 'bg-[#1A1A1A] text-white hover:bg-black hover:shadow-2xl'
                                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                }`}
                        >
                            {product.isAvailable === false ? "Indisponible" : dynamicStock > 0 ? "Demander l'acquisition" : "Épuisé"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;
