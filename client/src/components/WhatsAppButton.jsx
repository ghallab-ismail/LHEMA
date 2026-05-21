import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPixel from 'react-facebook-pixel';

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isStickyVisible, setIsStickyVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Match the threshold from StickyCTA.jsx
            if (window.scrollY > window.innerHeight * 0.8) {
                setIsStickyVisible(true);
            } else {
                setIsStickyVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const phoneNumber = "212709555824";

    const handleWhatsAppClick = () => {
        // Track the click for Facebook Pixel
        ReactPixel.track('Contact');
        ReactPixel.trackCustom('WhatsAppClick', {
            content_name: 'WhatsApp Contact Button',
            content_category: 'Social Contact'
        });
        
        // Construct dynamic message based on current product
        let message = "Bonjour Maison Lhema, je suis intéressée par vos créations";
        if (window.currentProductName) {
            message = `Bonjour Maison Lhema, je suis intéressée par l'article : ${window.currentProductName}`;
        }
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div
            className={`fixed right-6 z-50 flex items-center justify-end transition-all duration-500 ease-in-out ${isStickyVisible ? 'bottom-28 md:bottom-10' : 'bottom-6 md:bottom-10'
                }`}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        className="mr-4 hidden md:block"
                    >
                        <div className="rounded-full bg-lhema-cream px-4 py-2 shadow-xl border border-lhema-black/5">
                            <p className="font-serif text-xs text-lhema-black tracking-wide whitespace-nowrap">
                                Discuter avec nous
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                id="whatsapp-button"
                aria-label="WhatsApp Contact"
                type="button"
                onClick={handleWhatsAppClick}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-lhema-black text-lhema-cream shadow-sm transition-colors hover:bg-lhema-gold cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* Hidden text for accessibility and Meta Event Setup Tool detection */}
                <span className="sr-only">WhatsApp Contact</span>
                
                {/* Pulse Effect */}
                <span className="absolute -inset-1 rounded-full border border-lhema-gold/30 opacity-0 animate-ping" />

                {/* Custom WhatsApp Icon SVG - Monochrome/Styled */}
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            </motion.button>
        </div>
    );
};

export default WhatsAppButton;
