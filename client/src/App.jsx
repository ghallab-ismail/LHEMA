import React, { useEffect, Suspense, lazy } from 'react';
import Clarity from '@microsoft/clarity';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Atelier = lazy(() => import('./pages/Atelier'));
const Femme = lazy(() => import('./pages/Femme'));
const Homme = lazy(() => import('./pages/Homme'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const LegalPrivacy = lazy(() => import('./pages/LegalPrivacy'));
const LegalExchange = lazy(() => import('./pages/LegalExchange'));
const LegalDelivery = lazy(() => import('./pages/LegalDelivery'));
const LegalWarranty = lazy(() => import('./pages/LegalWarranty'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import ScrollToTop from './components/ScrollToTop';

function App() {
    // Wake up the Render backend as soon as the app loads
    // This way, by the time the user fills the form, the server is already awake
    useEffect(() => {
        // Initialize Microsoft Clarity
        Clarity.init("wbohg9nwgn");

        const timer = setTimeout(() => {
            fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => { });
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <Suspense fallback={<div className="h-screen w-full bg-lhema-cream" />}>
                <Routes>
                    {/* Public Routes with Custom Cursor & WhatsApp */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/femme" element={<Femme />} />
                        <Route path="/homme" element={<Homme />} />
                        <Route path="/atelier" element={<Atelier />} />
                        <Route path="/product/:id" element={<ProductDetail />} />

                        {/* Order Tracking */}
                        <Route path="/suivi" element={<OrderTracking />} />

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
            </Suspense>
        </Router>
    );
}

export default App;
