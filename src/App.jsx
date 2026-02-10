import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

function App() {
    return (
        <Router>
            <SmoothScroll>
                <CustomCursor />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
                </Routes>
            </SmoothScroll>
        </Router>
    );
}

export default App;
