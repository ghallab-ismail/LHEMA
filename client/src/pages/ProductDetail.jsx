import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import CheckoutModal from '../components/CheckoutModal';
import { products } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    // Ensure product lookup handles string vs number
    const product = products.find(p => p.id === parseInt(id) || p.id === id);
    const [activeImage, setActiveImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!product) return <div className="text-white">Product not found</div>;

    return (
        <div className="bg-primary-bg min-h-screen text-primary-text">
            <Navbar />
            <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Sticky Image Gallery */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden relative group">
                    <Link to="/" className="absolute top-24 left-6 z-20 mix-blend-difference text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <img
                        src={product.images[activeImage]}
                        alt={product.name}
                        className="w-full h-[60vh] lg:h-full object-cover animate-fade-in"
                    />

                    {/* Image Navigation Dots (Overlay) */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {product.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right: Scrollable Details */}
                <div className="w-full lg:w-1/2 px-6 py-12 lg:px-24 lg:py-32 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="border-b border-stone-300 pb-6 mb-8">
                            <h1 className="font-serif text-3xl md:text-5xl mb-2">{product.name}</h1>
                            <p className="font-sans text-xs tracking-[0.2em] text-stone-500 uppercase">
                                Archive {product.archive_year} — Edition 01/10
                            </p>
                        </div>

                        <div className="mb-12">
                            <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-800">
                                {product.price.toLocaleString()} DH
                            </p>
                        </div>

                        {/* Storytelling Block */}
                        <div className="mb-16 bg-stone-100 p-8 border-l-2 border-black">
                            <h3 className="font-serif text-lg mb-4">The Architecture</h3>
                            <p className="font-sans text-sm leading-7 text-stone-600">
                                {product.story}
                            </p>
                        </div>

                        {/* Fabric Details */}
                        <div className="flex items-center gap-4 mb-12 group cursor-pointer">
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-300 relative">
                                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-700" alt="Fabric" />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="font-serif text-sm">Material Composition</p>
                                <p className="font-sans text-xs text-stone-500">{product.material}</p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-black text-white py-4 px-8 text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors duration-300 flex justify-between items-center group"
                        >
                            <span>Acquire Piece</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                →
                            </span>
                        </button>

                        <p className="mt-4 text-[10px] text-center text-stone-400 font-sans tracking-wide">
                            Only {product.stock} pieces remaining in Atelier.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
