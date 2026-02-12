import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import StylingGuide from '../components/StylingGuide';
import StickyCTA from '../components/StickyCTA';
// import Lookbook from '../components/Lookbook';
// import ThreadReveal from '../components/ThreadReveal';
// import Narrative from '../components/Narrative';
import Texture from '../components/Texture';
// import Acquisition from '../components/Acquisition';
import NoiseOverlay from '../components/NoiseOverlay';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';

const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream">
            {/* Phase 1: The Curtain Raiser */}
            <Loader onComplete={() => setLoading(false)} />

            {!loading && (
                <>
                    <Navbar />

                    {/* Phase 2: The Hero Section */}
                    <Hero onReserve={() => setIsModalOpen(true)} />

                    {/* Phase 3: Social Proof */}
                    <SocialProof />

                    {/* Phase 4: Fabric Details (Formerly Texture) */}
                    <Texture />

                    {/* Phase 5: Styling Guide */}
                    <StylingGuide />

                    {/* Footer Sign-off */}
                    <Footer />

                    {/* Mobile Conversion */}
                    <StickyCTA onReserve={() => setIsModalOpen(true)} />

                    {/* Global Effects */}
                    <NoiseOverlay />

                    {/* Modal */}
                    <CheckoutModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={{ name: "The Signature Cape" }}
                    />

                    {/* Preserved components for future use if needed:
                    <Lookbook />
                    <ThreadReveal />
                    <Narrative />
                    <Acquisition />
                    */}
                </>
            )}
        </main>
    );
};

export default LandingPage;
