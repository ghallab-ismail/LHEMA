import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Menu from './Menu';

const Navbar = ({ theme = 'light' }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Initialize on mount
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMenuOpen]);

    const isDarkText = isScrolled || theme === 'dark';
    const textColorClass = isDarkText ? "text-lhema-black" : "text-lhema-cream";
    const navTextClass = theme === 'dark' ? 'text-lhema-black' : 'text-lhema-cream';

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
            </AnimatePresence>

            <nav
                className={twMerge(
                    'fixed top-0 left-0 w-full z-40 transition-all duration-700 ease-in-out py-6 px-6 md:px-12 flex justify-between items-center',
                    isScrolled ? 'bg-lhema-cream/90 backdrop-blur-md shadow-sm py-4' : `bg-transparent ${navTextClass}`
                )}
            >
                {/* Left: Menu */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="group flex items-center gap-2"
                    aria-label="Ouvrir le menu"
                >
                    <MenuIcon strokeWidth={1} className={clsx("w-6 h-6 transition-colors", textColorClass)} />
                    <span className={clsx("hidden md:block font-sans text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500", textColorClass)}>
                        Menu
                    </span>
                </button>

                {/* Center: Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link to="/">
                        <h2 className={clsx("font-serif text-xl md:text-2xl tracking-widest cursor-pointer", textColorClass)}>
                            MAISON LHEMA
                        </h2>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <Search strokeWidth={1} className={clsx("w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-500", textColorClass)} />
                    {/* <button className="relative">
                        <ShoppingBag strokeWidth={1} className={clsx("w-5 h-5 cursor-pointer hover:scale-110 transition-transform duration-500", textColorClass)} />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lhema-gold opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-lhema-gold"></span>
                        </span>
                    </button> */}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
