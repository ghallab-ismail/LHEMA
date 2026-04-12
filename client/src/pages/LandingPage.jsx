import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Prelude from '../components/Prelude';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import StylingGuide from '../components/StylingGuide';
import Exclusivity from '../components/Exclusivity';
import Distinction from '../components/Distinction';
import Bespoke from '../components/Bespoke';
import StickyCTA from '../components/StickyCTA';
// import Lookbook from '../components/Lookbook';
// import ThreadReveal from '../components/ThreadReveal';
// import Narrative from '../components/Narrative';
import Texture from '../components/Texture';
// import Acquisition from '../components/Acquisition';
import NoiseOverlay from '../components/NoiseOverlay';
import Footer from '../components/Footer';
import Packaging from '../components/Packaging';
import CheckoutModal from '../components/CheckoutModal';

const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const heroRef = useRef(null);

    const scrollToHero = () => {
        heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream">
            {/* Phase 1: The Curtain Raiser */}
            <Loader onComplete={() => setLoading(false)} />

            {!loading && (
                <>
                    <Navbar />

                    {/* Phase 1: Brand Prelude — static, loads instantly */}
                    <Prelude onDiscover={scrollToHero} />

                    {/* Phase 2: The Hero Section (Video) */}
                    <div ref={heroRef}>
                        <Hero onReserve={() => setIsModalOpen(true)} />
                    </div>

                    {/* Phase 3: Social Proof */}
                    <SocialProof />

                    {/* Phase 4: Fabric Details (Formerly Texture) */}
                    <Texture />

                    {/* Phase 5: Packaging Showcase */}
                    <Packaging />

                    {/* Phase 6: Exclusivity Manifesto */}
                    <Exclusivity />

                    {/* Phase 7: Distinction Narrative */}
                    <Distinction />

                    {/* Phase 8: Made-to-Measure Commitment */}
                    <Bespoke />

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
