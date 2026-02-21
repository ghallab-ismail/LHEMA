import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

const LegalWarranty = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-32 max-w-4xl mx-auto min-h-[80vh]">
                <h1 className="font-serif text-3xl md:text-5xl mb-12 text-center">GARANTIE</h1>
                <div className="font-sans text-sm md:text-base leading-relaxed space-y-8 opacity-80">
                    <p>
                        Une création Maison Lhema est conçue pour traverser le temps. Notre engagement se traduit par une garantie d'excellence et une attention continue portée à nos pièces, même après leur acquisition.
                    </p>
                    <div>
                        <h2 className="font-serif text-xl mb-4">1. La Garantie de Confection</h2>
                        <p>
                            Nos créations sont garanties contre tout défaut de fabrication grâce à nos examens minutieux réalisés avant chaque envoi. Une fois votre création livrée, la Maison se consacre à son entretien afin de préserver sa longévité et sa ligne sculpturale.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">2. Suivi et Entretien</h2>
                        <p>
                            Nous restons à la disposition de nos clientes pour tout conseil ou demande de restauration portant sur des altérations survenues lors du port de la pièce.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default LegalWarranty;
