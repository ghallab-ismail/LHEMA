import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';

const Menu = ({ onClose }) => {
    const primaryLinks = [
        { name: "COLLECTION", path: "/" },
        { name: "FEMME", path: "/femme" },
        { name: "HOMME", path: "/homme" },
        { name: "ATELIER", path: "/atelier" }
    ];
    const secondaryLinks = ["LA MAISON", "BOUTIQUES", "SERVICES", "COMPTE"];

    return (
        <motion.div
            className="fixed inset-0 z-50 flex h-screen w-full flex-col bg-lhema-cream text-lhema-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Header: Close & Search */}
            <div className="flex items-center justify-between px-6 py-6 md:px-12">
                <button onClick={onClose} className="group">
                    <X strokeWidth={1} className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
                </button>
                <button className="group">
                    <Search strokeWidth={1} className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col items-center justify-center space-y-12">

                {/* Primary Links (Top Half) */}
                <div className="flex flex-col items-center space-y-6 text-center">
                    {primaryLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.8 }}
                        >
                            <Link
                                to={link.path}
                                onClick={onClose}
                                className="font-serif text-3xl font-medium tracking-wide transition-colors hover:text-lhema-gold md:text-5xl"
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Separator / Spacer (Visual only, handled by space-y) */}

                {/* Secondary Links (Bottom Half) */}
                <div className="mt-12 flex flex-col items-center space-y-4 text-center">
                    {secondaryLinks.map((link, index) => (
                        <motion.a
                            key={link}
                            href="#"
                            className="font-sans text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-lhema-gold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (0.05 * index), duration: 0.8 }}
                        >
                            {link}
                        </motion.a>
                    ))}
                </div>

            </div>
        </motion.div>
    );
};

export default Menu;
