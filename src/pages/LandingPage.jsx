import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import Lookbook from '../components/Lookbook';
import ThreadReveal from '../components/ThreadReveal';
import Narrative from '../components/Narrative';
import Texture from '../components/Texture';
import Acquisition from '../components/Acquisition';
import NoiseOverlay from '../components/NoiseOverlay';
import Footer from '../components/Footer';

const LandingPage = () => {
    const [loading, setLoading] = useState(true);

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream">
            {/* Phase 1: The Curtain Raiser */}
            <Loader onComplete={() => setLoading(false)} />

            {!loading && (
                <>
                    <Navbar />
                    {/* Phase 2: The Hero Section */}
                    <Hero />

                    {/* Phase 2.5: The Lookbook */}
                    <Lookbook />

                    {/* Phase 2.75: Thread of Time */}
                    <ThreadReveal />

                    {/* Phase 3: The Narrative */}
                    <Narrative />

                    {/* Phase 4: The Texture */}
                    <Texture />

                    {/* Phase 5: The Acquisition */}
                    <Acquisition />

                    {/* Footer Sign-off */}
                    <Footer />

                    {/* Global Effects */}
                    <NoiseOverlay />
                </>
            )}
        </main>
    );
};

export default LandingPage;
