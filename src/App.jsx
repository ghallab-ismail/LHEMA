import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ComingSoon from './pages/ComingSoon';
import Atelier from './pages/Atelier';
import Femme from './pages/Femme';
import ProductDetail from './pages/ProductDetail';

import CustomCursor from './components/CustomCursor';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
    return (
        <Router>
            <CustomCursor />
            <WhatsAppButton />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/femme" element={<Femme />} />
                <Route path="/homme" element={<ComingSoon />} />
                <Route path="/atelier" element={<Atelier />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
