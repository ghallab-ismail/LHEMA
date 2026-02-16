import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { products } from '../data/products';

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for the entrance animation
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Loader isLoading={loading} />

            {!loading && (
                <div className="bg-primary-bg min-h-screen animate-fade-in">
                    <Navbar />
                    <Hero />

                    <main className="px-6 py-24 md:px-12 md:py-32">
                        <div className="mb-16">
                            <h2 className="font-serif text-2xl md:text-3xl tracking-wide border-b border-stone-200 pb-4">
                                The Archive - Collection 01
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </main>

                    <footer className="bg-black text-white py-12 text-center">
                        <p className="font-serif text-lg tracking-widest">MAISON LHEMA</p>
                        <p className="font-sans text-[10px] tracking-[0.3em] mt-4 text-stone-500 uppercase">
                            Casablanca — Paris
                        </p>
                    </footer>
                </div>
            )}
        </>
    );
};

export default Home;
