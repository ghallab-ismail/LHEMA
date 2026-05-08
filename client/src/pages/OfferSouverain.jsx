import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';
import Navbar from '../components/Navbar';
import CampaignCheckoutModal from '../components/CampaignCheckoutModal';


const OfferSouverain = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const hasAutoOpened = useRef(false);
    const bottomRef = useRef(null);

    // Hardcoded static product - Modify price here to test
    const product = {
        name: "L'Ensemble Souverain",
        price: 499, // <-- CHANGE PRICE HERE FOR TESTING
        currency: "MAD",
        isAvailable: true,
        images: [
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417648/lhema_products/zt9z29gaeehr9dxvrhmn.jpg",
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417689/lhema_products/mgdug7vcpphztedv55nr.jpg",
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417689/lhema_products/durhmqd6m8xii9lx9fyr.jpg",
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417689/lhema_products/yovt0vel2kqfjjdv4pwp.jpg",
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417689/lhema_products/ywged7m1sdk3l21pwkh7.jpg",
            "https://res.cloudinary.com/dvtwcbaoh/image/upload/v1777417690/lhema_products/oy5gvqftqweqgkkbv1ti.jpg"
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        description_title: "L'Élégance Exclusive : Votre Pièce d'Exception",
        description_subtitle: "Découvrez le raffinement absolu avec une création conçue pour vous faire sentir unique.",
        features: [
            {
                title: "Le Satin Prestigieux",
                desc: "Un tissu noble, fluide et brillant. C'est l'allié parfait pour vous envelopper d'élégance."
            },
            {
                title: "Des Finitions Artisanales",
                desc: "Les bordures et les côtés sont minutieusement travaillés à la main. Un détail raffiné qui fait de cette création une véritable pièce rare."
            }
        ]
    };

    useEffect(() => {
        // Fire Facebook Pixel ViewContent event
        ReactPixel.track('ViewContent', {
            content_name: product.name,
            content_type: 'product',
            value: product.price,
            currency: product.currency,
        });
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyButton(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && window.scrollY > 150 && !hasAutoOpened.current) {
                    setIsModalOpen(true);
                    hasAutoOpened.current = true;
                }
            },
            { rootMargin: "50px" }
        );

        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, []);

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            setActiveImage((prev) => (prev + 1) % product.images.length);
        } else if (info.offset.x > swipeThreshold) {
            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    };

    return (
        <main className="bg-[#FAF9F6] min-h-screen text-stone-900 font-sans pb-24 lg:pb-0 relative">
            <div className="relative z-50">
                <Navbar theme="dark" />
            </div>

            <CampaignCheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Sticky Image Gallery */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden relative group bg-[#FAF9F6]">
                    <div
                        className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-40 blur-[60px] scale-110 transition-all duration-700"
                        style={{ backgroundImage: `url(${product.images[activeImage]})` }}
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

                    {/* Mobile View */}
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
                        <div className="w-full flex flex-col items-center md:items-start text-center md:text-left">
                            {/* Stars First for premium feel */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1} />
                                ))}
                            </div>

                            {/* Product Title */}
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight text-stone-900">
                                {product.name}
                            </h1>

                            {/* Price & Stock Badge */}
                            <div className="flex items-center gap-4 mb-10">
                                <p className="font-serif text-2xl text-stone-900 font-medium">
                                    {product.price.toLocaleString()} {product.currency}
                                </p>
                                <div className="flex items-center gap-1.5 bg-[#FAF9F6] text-stone-600 px-3 py-1 rounded-sm border border-stone-200">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="font-sans text-[9px] uppercase tracking-widest font-semibold">En Stock</span>
                                </div>
                            </div>

                            {/* Elegant Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent md:bg-stone-200 md:bg-none mb-10"></div>

                            {/* Intro / Catchphrase */}
                            <h4 className="font-serif text-xl lg:text-2xl mb-4 text-stone-800 leading-snug">
                                {product.description_title}
                            </h4>
                            <p className="text-stone-500 font-sans text-sm md:text-base leading-relaxed italic max-w-md mb-12">
                                "{product.description_subtitle}"
                            </p>

                            {/* Features Card */}
                            <div className="w-full bg-white p-8 lg:p-10 border border-stone-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
                                <h2 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-8 font-bold text-center">
                                    Savoir-Faire & Composition
                                </h2>
                                <div className="space-y-8 text-left">
                                    {product.features.map((feature, idx) => (
                                        <div key={idx} className="flex flex-col gap-1.5 border-b border-stone-100 pb-6 last:border-0 last:pb-0">
                                            <strong className="text-stone-900 font-serif text-[15px] uppercase tracking-wider">
                                                {feature.title}
                                            </strong>
                                            <span className="text-stone-600 font-sans text-sm leading-relaxed">
                                                {feature.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
                        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-40"
                    >
                        <div className="flex flex-col items-center justify-center w-full p-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full max-w-md py-4 px-6 font-sans text-sm tracking-wide font-medium uppercase transition-colors duration-300 bg-[#111111] text-white hover:bg-[#333333]"
                            >
                                COMMANDER
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={bottomRef} className="absolute bottom-0 w-full h-1 pointer-events-none" />
        </main>
    );
};

export default OfferSouverain;
