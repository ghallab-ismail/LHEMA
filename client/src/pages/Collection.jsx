import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import NoiseOverlay from '../components/NoiseOverlay';
import { products as staticProducts } from '../data/products';
import { motion } from 'framer-motion';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products (no category filter)
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                if (response.ok) {
                    const dbProducts = await response.json();
                    
                    // Combine with static products
                    const staticNames = staticProducts.map(p => p.name.toLowerCase());
                    const newDbProducts = (Array.isArray(dbProducts) ? dbProducts : []).filter(
                        p => !staticNames.includes(p.name.toLowerCase())
                    );
                    setProducts([...newDbProducts, ...staticProducts]);
                }
            } catch (err) {
                console.error('Error fetching collection products:', err);
                setProducts(staticProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [filter, setFilter] = useState('all'); // 'all', 'limited', 'standard'

    const filteredProducts = products.filter(product => {
        if (filter === 'limited') return product.is_limited_edition;
        if (filter === 'standard') return !product.is_limited_edition;
        return true;
    });

    return (
        <main className="relative min-h-screen w-full bg-lhema-cream text-lhema-black">
            <Navbar theme="dark" />
            <NoiseOverlay />

            <section className="pt-40 px-6 pb-20 max-w-7xl mx-auto min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">LA COLLECTION</h1>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] max-w-xl mx-auto opacity-70 leading-relaxed">
                        Des créations uniques qui allient tradition et modernité.
                    </p>
                </motion.div>

                {/* Filter section */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`font-sans text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300 ${filter === 'all' ? 'bg-black text-white shadow-md' : 'bg-transparent text-stone-500 hover:text-black border border-stone-200'}`}
                    >
                        Tout Voir
                    </button>
                    <button 
                        onClick={() => setFilter('limited')}
                        className={`font-sans text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300 flex items-center gap-2 ${filter === 'limited' ? 'bg-[#D4AF37] text-white shadow-md border border-[#D4AF37]' : 'bg-transparent text-stone-500 hover:text-[#D4AF37] border border-stone-200'}`}
                    >
                        {filter === 'limited' && (
                            <div className="relative flex h-1.5 w-1.5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
                            </div>
                        )}
                        Éditions Limitées (10 Pièces)
                    </button>
                    <button 
                        onClick={() => setFilter('standard')}
                        className={`font-sans text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 transition-all duration-300 ${filter === 'standard' ? 'bg-black text-white shadow-md' : 'bg-transparent text-stone-500 hover:text-black border border-stone-200'}`}
                    >
                        Collection Permanente
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-24 opacity-40">
                        <p className="font-serif text-2xl mb-2">Bientôt disponible</p>
                        <p className="font-sans text-xs uppercase tracking-widest">Aucune pièce trouvée pour cette sélection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
};

export default Collection;
