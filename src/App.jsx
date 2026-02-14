import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import CustomCursor from './components/CustomCursor';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
    return (
        <Router>
            <CustomCursor />
            <WhatsAppButton />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
