import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-lhema-cream py-16 px-6 md:px-12 flex flex-col items-center border-t border-lhema-black/10">
            <h2 className="font-serif text-2xl tracking-widest text-lhema-black mb-12">
                MAISON LHEMA
            </h2>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16 px-4">
                <Link to="/legal/privacy" className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-lhema-black/60 hover:text-lhema-gold transition-colors duration-300">
                    Politique de Confidentialité
                </Link>
                <Link to="/legal/exchange" className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-lhema-black/60 hover:text-lhema-gold transition-colors duration-300">
                    Conditions d'Échange
                </Link>
                <Link to="/legal/delivery" className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-lhema-black/60 hover:text-lhema-gold transition-colors duration-300">
                    Livraison
                </Link>
                <Link to="/legal/warranty" className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-lhema-black/60 hover:text-lhema-gold transition-colors duration-300">
                    Garantie
                </Link>
            </div>

            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-lhema-black/40">
                Maison Lhema. Casablanca, 1952. Tous droits réservés.
            </p>
        </footer>
    );
};

export default Footer;
