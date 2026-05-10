import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import CheckoutModal from '../components/CheckoutModal';
import EssayagePriveModal from '../components/EssayagePriveModal';
import { products as staticProducts } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEssayageModalOpen, setIsEssayageModalOpen] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const hasAutoOpened = useRef(false);
    const bottomRef = useRef(null);

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

    // For static products with a preset completed_count, use it as floor
    const effectiveCompleted = Math.max(completedCount, product?.completed_count || 0);
    
    // For limited editions, calculate dynamic stock. For regular products, use product.stock or default to a large number.
    const dynamicStock = product 
        ? (product.is_limited_edition 
            ? Math.max(0, (product.total_edition || 10) - effectiveCompleted)
            : (product.stock !== undefined ? product.stock : 999)) 
        : 0;

    // Product is purchasable only if isAvailable is true AND there is stock
    const isProductAvailable = product ? (product.isAvailable !== false && dynamicStock > 0) : false;

    useEffect(() => {
        const handleScroll = () => {
            // Reading window.scrollY does not trigger forced reflows
            setShowStickyButton(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Use IntersectionObserver instead of reading documentHeight on scroll
        // This completely eliminates layout thrashing (Forced Reflows)
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && window.scrollY > 150 && !hasAutoOpened.current) {
                    setIsModalOpen(true);
                    hasAutoOpened.current = true;
                }
            },
            { rootMargin: "50px" } // Trigger 50px before reaching the actual bottom
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleSurMesureClick = () => {
        // Trigger the standard checkout/measurement form modal
        setIsModalOpen(true);
    };

    const handleEssayagePriveClick = () => {
        setIsEssayageModalOpen(true);
    };

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
        <main className="bg-[#FAF9F6] min-h-screen text-stone-900 font-sans pb-24 lg:pb-0 relative">
            {/* The Navbar needs to be absolute or sticky so content goes under it/starts below it properly,
                in the original code it's fixed. Let's make sure it has z-index and the content pushes down slightly. */}
            <div className="relative z-50">
                <Navbar theme="dark" />
            </div>

            <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />
            <EssayagePriveModal isOpen={isEssayageModalOpen} onClose={() => setIsEssayageModalOpen(false)} product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Sticky Image Gallery */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden relative group bg-[#FAF9F6]">
                    
                    {/* Ambient Blurred Background for Desktop to fill empty space */}
                    <div 
                        className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-40 blur-[60px] scale-110 transition-all duration-700" 
                        style={{ backgroundImage: `url(${product?.images[activeImage]})` }} 
                    />

                    <Link to="/" className="absolute top-[80px] left-6 z-20 mix-blend-difference text-white" aria-label="Retour à l'accueil">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="hidden lg:flex lg:items-center lg:justify-center h-full w-full pt-[80px] pb-10 relative z-10">
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            fetchPriority={activeImage === 0 ? "high" : "auto"}
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
                                fetchPriority={activeImage === 0 ? "high" : "auto"}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Mobile Thumbnails Section */}
                    <div className="lg:hidden relative w-full bg-white border-b border-stone-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                        {/* Elegant swipe instruction */}
                        <div className="w-full flex items-center justify-center pt-4 pb-1">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-sans flex items-center gap-2">
                                Faites glisser pour découvrir 
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 animate-pulse"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </div>

                        {/* Fading edge to strongly indicate scrollability */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                        
                        <div className="w-full pl-5 pr-12 py-4 flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative shrink-0 aspect-[3/4] w-[4.5rem] snap-center transition-all duration-500 ease-out rounded-sm ${activeImage === idx
                                            ? 'ring-1 ring-[#D4AF37] ring-offset-4 ring-offset-white opacity-100 scale-100'
                                            : 'opacity-50 grayscale-[15%] hover:opacity-80 scale-95'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} vue ${idx + 1}`} className="w-full h-full object-cover shadow-sm rounded-sm" />
                                    <div className="absolute inset-0 border border-black/10 pointer-events-none rounded-sm"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Nav Dots (Desktop Only) */}
                    <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 items-center justify-center z-10 bg-black/10 px-1 rounded-full backdrop-blur-sm">
                        {product.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className="w-12 h-12 flex items-center justify-center"
                            >
                                <span className={`block h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50 w-2'}`} />
                            </button>
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
                            </div>
                        </div>

                        {/* Stock & Edition Visualization */}
                        {product.is_limited_edition ? (() => {
                            const total = product.total_edition || 10;
                            const available = dynamicStock;
                            const sold = total - available;
                            return (
                                <div className="mb-10 relative">
                                    {/* Top gold accent line */}
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
                                    
                                    <div className="border border-[#D4AF37]/30 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F3] p-6 lg:p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden">
                                        {/* Subtle background number watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                            <span className="font-serif text-[180px] md:text-[220px] leading-none text-stone-900 select-none">{total}</span>
                                        </div>

                                        {/* Header */}
                                        <div className="text-center mb-6 relative">
                                            <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-2 font-bold">Édition Numérotée</p>
                                            <h3 className="font-serif text-lg md:text-xl text-stone-900 mb-1">Collection Privée</h3>
                                            <p className="font-sans text-xs text-stone-400">{total} exemplaires uniques au Maroc</p>
                                        </div>

                                        {/* Numbered Slots Grid */}
                                        <div className="grid grid-cols-5 gap-2 md:gap-2.5 mb-6 max-w-xs mx-auto relative">
                                            {Array.from({ length: total }).map((_, i) => {
                                                const isSold = i < sold;
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.85 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.4, delay: 0.05 * i }}
                                                        className={`aspect-square flex items-center justify-center relative group transition-all duration-500 ${
                                                            isSold
                                                                ? 'bg-stone-100 border border-stone-200/80'
                                                                : 'bg-[#1A1A1A] border border-[#2C2C2C] shadow-sm hover:shadow-md hover:border-[#D4AF37]/40'
                                                        }`}
                                                    >
                                                        {isSold ? (
                                                            <>
                                                                <span className="font-serif text-sm md:text-base text-stone-300 select-none">
                                                                    {(i + 1).toString().padStart(2, '0')}
                                                                </span>
                                                                {/* Subtle diagonal line for sold */}
                                                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                                    <div className="absolute top-0 right-0 bottom-0 left-0">
                                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-px bg-stone-300/60 rotate-45"></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="font-serif text-sm md:text-base text-stone-400 group-hover:text-[#D4AF37] transition-colors duration-500 select-none">
                                                                    {(i + 1).toString().padStart(2, '0')}
                                                                </span>
                                                                {/* Subtle gold corner accent on hover */}
                                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-[#D4AF37]/40 transition-all duration-500"></div>
                                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-[#D4AF37]/40 transition-all duration-500"></div>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Stock Counter */}
                                        <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-200/60">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-[#1A1A1A] rounded-full"></div>
                                                <span className="font-sans text-[10px] uppercase tracking-widest text-stone-400">Disponible</span>
                                            </div>
                                            <span className="text-stone-300">·</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-stone-200 rounded-full"></div>
                                                <span className="font-sans text-[10px] uppercase tracking-widest text-stone-400">Acquis</span>
                                            </div>
                                        </div>
                                        <p className="text-center font-sans text-sm text-stone-500 mt-3">
                                            Pièces restantes : <span className="text-[#D4AF37] font-semibold text-lg">{available}</span> <span className="opacity-40 text-xs">/ {total}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })() : (
                            <div className="mb-10 relative group">
                                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
                                <div className="border border-[#D4AF37]/30 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F3] p-8 lg:p-10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden text-center transition-all duration-500 hover:shadow-[0_15px_40px_-15px_rgba(212,175,55,0.2)]">
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-700">
                                        <span className="font-serif text-[120px] md:text-[180px] leading-none text-stone-900 select-none">∞</span>
                                    </div>
                                    <p className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] mb-3 font-bold">Collection Permanente</p>
                                    <h3 className="font-serif text-xl md:text-2xl text-stone-900 mb-4">Pièce Intemporelle</h3>
                                    <div className="w-8 h-[1px] bg-[#D4AF37] mx-auto mb-4"></div>
                                    <p className="font-sans text-sm text-stone-500 max-w-sm mx-auto leading-relaxed relative z-10">
                                        Une création pensée pour durer, alliant excellence artisanale et élégance absolue. Disponible en quantité généreuse pour satisfaire votre quête de perfection.
                                    </p>
                                    <div className="mt-8 flex items-center justify-center gap-3">
                                        <div className="relative flex h-3 w-3 items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-40"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                                        </div>
                                        <span className="font-sans text-[10px] uppercase tracking-widest text-stone-700 font-medium">Disponible sur Commande</span>
                                    </div>
                                </div>
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

            {/* Sticky Floating CTA - Dual-Path Conversion */}
            <AnimatePresence>
                {showStickyButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40"
                    >
                        <div className="flex flex-col items-center justify-center w-full p-4">
                            <button
                                onClick={handleSurMesureClick}
                                disabled={!isProductAvailable}
                                className={`w-full max-w-md py-4 px-6 font-sans text-sm tracking-wide font-medium uppercase transition-colors duration-300 ${
                                    isProductAvailable 
                                    ? 'bg-[#111111] text-white hover:bg-[#333333]' 
                                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                }`}
                            >
                                {product.isAvailable === false ? "Indisponible" : dynamicStock > 0 ? (product.is_limited_edition ? "COMMANDER SUR-MESURE" : "COMMANDER") : "Épuisé"}
                            </button>
                            {product.is_limited_edition && (
                                <button
                                    onClick={handleEssayagePriveClick}
                                    className="mt-3 text-xs sm:text-sm text-gray-500 font-serif relative group transition-colors duration-300 hover:text-black"
                                >
                                    Résidente à Casablanca ou Rabat ? Demandez votre essayage privé.
                                    <span className="absolute left-0 bottom-0 w-full h-[0.5px] bg-gray-400 group-hover:bg-black transition-colors duration-300"></span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invisible element at the bottom to trigger the IntersectionObserver */}
            <div ref={bottomRef} className="absolute bottom-0 w-full h-1 pointer-events-none" />
        </main>
    );
};

export default ProductDetail;
