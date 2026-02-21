import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NoiseOverlay from '../components/NoiseOverlay';

const LegalDelivery = () => {
    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-32 max-w-4xl mx-auto min-h-[80vh]">
                <h1 className="font-serif text-3xl md:text-5xl mb-12 text-center">LIVRAISON</h1>
                <div className="font-sans text-sm md:text-base leading-relaxed space-y-8 opacity-80">
                    <p>
                        La Maison Lhema accorde un soin absolu de la création jusqu'à l'acheminement de votre pièce. Nos services de livraison sont pensés afin que votre expérience soit d'une excellence irréprochable.
                    </p>
                    <div>
                        <h2 className="font-serif text-xl mb-4">1. Délais et Confection</h2>
                        <p>
                            Nos créations étant confectionnées à la demande et nécessitant un travail artisanal rigoureux, le délai de livraison standard est estimé entre 2 à 4 semaines après l'activation de votre réservation.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">2. Expédition</h2>
                        <p>
                            Chaque colis est préparé dans notre atelier avec une attention minutieuse, protégé dans notre écrin signature. Nous collaborons avec des transporteurs privés de confiance pour assurer l'arrivée sécurisée et soignée de votre création.
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-xl mb-4">3. Remise en Main Propre</h2>
                        <p>
                            Pour nos clients résidant à Casablanca, un service courtois de remise en main propre peut être arrangé sur demande, afin de vous présenter personnellement votre création.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default LegalDelivery;
