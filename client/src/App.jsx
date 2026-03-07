import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ComingSoon from './pages/ComingSoon';
import Atelier from './pages/Atelier';
import Femme from './pages/Femme';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import PublicLayout from './layouts/PublicLayout';
import ScrollToTop from './components/ScrollToTop';

import LegalPrivacy from './pages/LegalPrivacy';
import LegalExchange from './pages/LegalExchange';
import LegalDelivery from './pages/LegalDelivery';
import LegalWarranty from './pages/LegalWarranty';
import NotFound from './pages/NotFound';

function App() {
    // Wake up the Render backend as soon as the app loads
    // This way, by the time the user fills the form, the server is already awake
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => { });
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Public Routes with Custom Cursor & WhatsApp */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/femme" element={<Femme />} />
                    <Route path="/homme" element={<ComingSoon />} />
                    <Route path="/atelier" element={<Atelier />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* Legal Routes */}
                    <Route path="/legal/privacy" element={<LegalPrivacy />} />
                    <Route path="/legal/exchange" element={<LegalExchange />} />
                    <Route path="/legal/delivery" element={<LegalDelivery />} />
                    <Route path="/legal/warranty" element={<LegalWarranty />} />
                </Route>

                {/* Admin Routes (Hidden Access) */}
                <Route path="/portal-lhema-access/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/portal-lhema-access" element={<AdminDashboard />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
