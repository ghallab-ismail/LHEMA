import React from 'react';
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

function App() {
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

                {/* Admin Routes (Clean UI) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
