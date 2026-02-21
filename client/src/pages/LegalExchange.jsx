import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

const LegalExchange = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-32 max-w-4xl mx-auto min-h-[80vh]">
                <h1 className="font-serif text-3xl md:text-5xl mb-12 text-center">CONDITIONS D'ÉCHANGE</h1>
                <div className="font-sans text-sm md:text-base leading-relaxed space-y-8 opacity-80">
                    <p>
                        Chaque création de la Maison Lhema est conçue pour correspondre idéalement à vos attentes. Si toutefois l'un de nos modèles nécessitait d'être échangé, nous vous invitons à prendre connaissance de nos conditions d'échange, conçues pour vous assurer la meilleure expérience.
                    </p>
                    <div>
                        <h2 className="font-serif text-xl mb-4">1. Délai d'Échange</h2>
                        <p>
                            Vous disposez d'un délai de 14 jours suivant la réception de votre création pour initier une procédure d'échange. La pièce doit nous être retournée dans son écrin d'origine.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">2. État de la Pièce</h2>
                        <p>
                            L'article retourné doit être parfaitement neuf, non porté, non lavé, et avec toutes ses étiquettes intactes. Tout article ne respectant pas ces conditions, ou ayant été altéré, ne pourra faire l'objet d'un échange.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">3. Pièces Sur-Mesure</h2>
                        <p>
                            Veuillez noter que les créations personnalisées, ajustées sur-mesure ou altérées à votre demande lors de l'acquisition sont définitives et ne peuvent être ni reprises ni échangées.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">4. Procédure</h2>
                        <p>
                            Pour organiser un échange, veuillez contacter notre équipe d'artisans via notre service client. Nous nous ferons une joie de vous accompagner tout au long du processus.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default LegalExchange;
