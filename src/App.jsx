import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import CustomCursor from './components/CustomCursor';

function App() {
    return (
        <Router>
            <CustomCursor />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
