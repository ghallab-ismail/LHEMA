import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

const LegalPrivacy = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-32 max-w-4xl mx-auto min-h-[80vh]">
                <h1 className="font-serif text-3xl md:text-5xl mb-12 text-center">POLITIQUE DE CONFIDENTIALITÉ</h1>
                <div className="font-sans text-sm md:text-base leading-relaxed space-y-8 opacity-80">
                    <p>
                        Chez Maison Lhema, l'art de l'élégance s'accompagne d'un respect absolu de votre vie privée. Nous accordons une importance primordiale à la confidentialité et à la sécurité de vos données personnelles. Cette politique de confidentialité détaille la manière dont nous protégeons vos informations avec le même soin que nous apportons à nos créations.
                    </p>
                    <div>
                        <h2 className="font-serif text-xl mb-4">1. Collecte des Données</h2>
                        <p>
                            Nous collectons uniquement les informations nécessaires pour vous offrir une expérience d'exception : vos coordonnées pour les commandes sur-mesure, vos préférences de style, et les informations de livraison.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">2. Utilisation des Informations</h2>
                        <p>
                            Vos données sont utilisées exclusivement pour le traitement de vos demandes d'acquisition, la personnalisation de nos services, et pour vous adresser nos invitations privées pour nos futures collections.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">3. Protection et Sécurité</h2>
                        <p>
                            La sécurité de vos informations est garantie par des protocoles rigoureux. Nous ne partageons, vendons ni ne louons vos données à des tiers.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default LegalPrivacy;
