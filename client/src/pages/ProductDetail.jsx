import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Truck, RefreshCw, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import EssayagePriveModal from '../components/EssayagePriveModal';
import { products as staticProducts } from '../data/products';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isEssayageModalOpen, setIsEssayageModalOpen] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);
    const [openAccordion, setOpenAccordion] = useState(0);
    const toggleAccordion = (idx) => setOpenAccordion(openAccordion === idx ? null : idx);

    // Form state
    const [formData, setFormData] = useState({ name: '', whatsapp: '', city: '', size: 'Sur Mesure', mensurations: '', color: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const SIZE_LABELS = {
        'XS': 'XS',
        'S': 'S',
        'M': 'M (Épaules: 42-45 cm)',
        'L': 'L (Épaules: 46-49 cm)',
        'XL': 'XL (Épaules: 50-53 cm)',
        'XXL': 'XXL (Épaules: 54-57 cm)',
        'Sur Mesure': 'Sur Mesure'
    };

    const isLightColor = (hex) => {
        if (!hex) return false;
        const color = hex.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155;
    };

    const getAvailableSizes = () => {
        if (!product?.sizes || product.sizes.length === 0) {
            return ['M (Épaules: 42-45 cm)', 'L (Épaules: 46-49 cm)', 'XL (Épaules: 50-53 cm)', 'XXL (Épaules: 54-57 cm)', 'Sur Mesure'];
        }
        return product.sizes.map(s => SIZE_LABELS[s] || s);
    };

    const availableSizes = getAvailableSizes();

    useEffect(() => {
        if (product) {
            let updates = {};
            if (availableSizes.length > 0 && !availableSizes.includes(formData.size)) {
                updates.size = availableSizes[0];
            }
            if (product.hasColors && product.colors?.length > 0) {
                if (!product.colors.find(c => c.name === formData.color)) {
                    updates.color = product.colors[0].name;
                }
            }
            if (Object.keys(updates).length > 0) {
                setFormData(prev => ({ ...prev, ...updates }));
            }
        }
    }, [product, availableSizes, formData.size, formData.color]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire.';
        else if (formData.name.trim().length < 2) newErrors.name = 'Le nom doit contenir au moins 2 caractères.';

        const cleanedPhone = formData.whatsapp.replace(/\s/g, '');
        if (!cleanedPhone) newErrors.whatsapp = 'Le numéro WhatsApp est obligatoire.';
        else if (!/^\+?\d{8,15}$/.test(cleanedPhone)) newErrors.whatsapp = 'Numéro invalide.';

        if (!formData.city.trim()) newErrors.city = 'La ville est obligatoire.';
        return newErrors;
    };

    const handleFieldChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            const productNameToSend = product?.name || "Produit sans nom";

            const finalSize = formData.size === 'Sur Mesure' 
                ? `Sur Mesure` 
                : formData.size;
            
            let sizeWithMensurations = finalSize;
            if (product?.hasColors && formData.color) {
                sizeWithMensurations += ` - Couleur: ${formData.color}`;
            }
            if (formData.mensurations?.trim()) {
                sizeWithMensurations += ` - Mensurations: ${formData.mensurations.trim()}`;
            }

            // Create inquiry
            const inquiryResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    size: sizeWithMensurations,
                    productName: productNameToSend
                }),
            });
            const inquiryData = await inquiryResponse.json();

            // Create order with tracking code
            const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    whatsapp: formData.whatsapp,
                    city: formData.city,
                    size: sizeWithMensurations,
                    productName: productNameToSend,
                    inquiryId: inquiryData._id
                }),
            });

            if (inquiryResponse.ok && orderResponse.ok) {
                const orderData = await orderResponse.json();
                navigate(`/suivi?code=${orderData.trackingCode}&success=true&returnUrl=${encodeURIComponent(window.location.pathname)}`);
            } else {
                console.error('Submission failed');
            }
            setSubmitting(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitting(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-transparent border-b py-3 text-black focus:outline-none transition-colors font-serif placeholder-stone-300 text-[13px] ${errors[field] ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-[#D4AF37]'}`;

    const policies = [
        {
            title: "Livraison Privilège",
            icon: <Truck className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />,
            content: "Expédition rapide et sécurisée. La livraison est assurée par nos coursiers de confiance partout au Maroc. Vous avez la possibilité d'inspecter votre colis avant de régler."
        },
        {
            title: "Paiement à la Livraison",
            icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />,
            content: "Aucune avance n'est requise par carte bancaire. Vous réglez votre commande en espèces directement auprès du livreur lors de la réception de votre pièce."
        },
        {
            title: "Échange Garanti",
            icon: <RefreshCw className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />,
            content: "L'art du sur-mesure exige la perfection. Si la taille ne correspond pas exactement à vos attentes, nous organisons un échange rapide et gratuit à notre charge."
        }
    ];

    // Wake up the Render backend immediately when user lands on the product page
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => { });
    }, []);

    // Load product: try static first, then API
    useEffect(() => {
        const slugify = (text) => {
            if (!text) return '';
            return text.toString().toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        };

        const staticProduct = staticProducts.find(p => p.id === parseInt(id) || p.id === id || (p.name && slugify(p.name) === id));
        if (staticProduct) {
            setProduct(staticProduct);
            setProductLoading(false);
            return;
        }
        // Fetch from API (DB product by _id)
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    setProduct(null);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setProductLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) {
            window.currentProductName = null;
            return;
        }

        // Set the global product name for the WhatsApp button
        window.currentProductName = product.name;

        const fetchCompletedCount = async () => {
            try {
                // Fetch by product.id or product._id (for DB products)
                const pid = product.id || product._id;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/completed-count?productId=${encodeURIComponent(pid)}&productName=${encodeURIComponent(product.name)}`);
                if (response.ok) {
                    const data = await response.json();
                    setCompletedCount(data.count || 0);
                }
            } catch (err) {
                console.error('Error fetching completed inquiries count:', err);
            }
        };

        fetchCompletedCount();

        return () => {
            window.currentProductName = null;
        };
    }, [product]);

    // For static products with a preset completed_count, use it as floor
    const effectiveCompleted = Math.max(completedCount, product?.completed_count || 0);
    
    // For limited editions, calculate dynamic stock. For regular products, use product.stock or default to a large number.
    const dynamicStock = product 
        ? (product.is_limited_edition 
            ? Math.max(0, (product.total_edition || 10) - effectiveCompleted)
            : (product.stock !== undefined ? product.stock : 999)) 
        : 0;

    // Product is purchasable only if isAvailable is true AND there is stock
    const isProductAvailable = product ? (product.isAvailable !== false && dynamicStock > 0) : false;

    useEffect(() => {
        const handleScroll = () => {
            // Reading window.scrollY does not trigger forced reflows
            setShowStickyButton(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEssayagePriveClick = () => {
        setIsEssayageModalOpen(true);
    };

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            // Swipe left (next image)
            setActiveImage((prev) => (prev + 1) % product.images.length);
        } else if (info.offset.x > swipeThreshold) {
            // Swipe right (previous image)
            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    };

    if (productLoading) return (
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center text-stone-600">
            <p className="font-serif text-2xl mb-2">Produit introuvable</p>
            <a href="/" className="text-xs uppercase tracking-widest underline mt-4">Retour à l'accueil</a>
        </div>
    );

    return (
        <main className="bg-[#FAF9F6] min-h-screen text-stone-900 font-sans pb-24 lg:pb-0 relative">
            {/* The Navbar needs to be absolute or sticky so content goes under it/starts below it properly,
                in the original code it's fixed. Let's make sure it has z-index and the content pushes down slightly. */}
            <div className="relative z-50">
                <Navbar theme="dark" />
            </div>

            <EssayagePriveModal isOpen={isEssayageModalOpen} onClose={() => setIsEssayageModalOpen(false)} product={product} />

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left: Sticky Image Gallery */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-hidden relative group bg-[#FAF9F6]">
                    
                    {/* Ambient Blurred Background for Desktop to fill empty space */}
                    <div 
                        className="hidden lg:block absolute inset-0 bg-cover bg-center opacity-40 blur-[60px] scale-110 transition-all duration-700" 
                        style={{ backgroundImage: `url(${product?.images[activeImage]})` }} 
                    />

                    <Link to="/collection" className="absolute top-[80px] left-6 z-20 mix-blend-difference text-white" aria-label="Retour à la collection">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="hidden lg:flex lg:items-center lg:justify-center h-full w-full pt-[80px] pb-10 relative z-10">
                        <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                            fetchPriority={activeImage === 0 ? "high" : "auto"}
                        />
                    </div>

                    {/* Mobile View: Swipeable Carousel */}
                    <div className="lg:hidden w-full h-[75vh] pt-[60px] relative overflow-hidden flex items-center justify-center">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.img
                                key={activeImage}
                                src={product.images[activeImage]}
                                alt={product.name}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full object-cover absolute top-0 left-0 pt-[60px] cursor-grab active:cursor-grabbing"
                                fetchPriority={activeImage === 0 ? "high" : "auto"}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Mobile Thumbnails Section */}
                    <div className="lg:hidden relative w-full bg-white border-b border-stone-200/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                        {/* Elegant swipe instruction */}
                        <div className="w-full flex items-center justify-center pt-4 pb-1">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-sans flex items-center gap-2">
                                Faites glisser pour découvrir 
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 animate-pulse"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                        </div>

                        {/* Fading edge to strongly indicate scrollability */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
                        
                        <div className="w-full pl-5 pr-12 py-4 flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative shrink-0 aspect-[3/4] w-[4.5rem] snap-center transition-all duration-500 ease-out rounded-sm ${activeImage === idx
                                            ? 'ring-1 ring-[#D4AF37] ring-offset-4 ring-offset-white opacity-100 scale-100'
                                            : 'opacity-50 grayscale-[15%] hover:opacity-80 scale-95'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} vue ${idx + 1}`} className="w-full h-full object-cover shadow-sm rounded-sm" />
                                    <div className="absolute inset-0 border border-black/10 pointer-events-none rounded-sm"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Nav Dots (Desktop Only) */}
                    <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 items-center justify-center z-10 bg-black/10 px-1 rounded-full backdrop-blur-sm">
                        {product.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className="w-12 h-12 flex items-center justify-center"
                            >
                                <span className={`block h-2 rounded-full transition-all duration-300 ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50 w-2'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Scrollable Details */}
                <div className="w-full lg:w-1/2 px-6 py-8 lg:px-16 lg:py-24 flex flex-col lg:pt-32 bg-[#FAF9F6] lg:bg-white lg:shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.03)] z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-md mx-auto w-full"
                    >
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-500">Maison Lhema</span>
                                {product.is_limited_edition && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Édition Limitée</span>
                                    </>
                                )}
                            </div>
                            
                            <h1 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 leading-tight">{product.name}</h1>

                            {/* Trust badges & Rating */}
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-stone-200/60">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < (product.stars !== undefined ? product.stars : 5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'}`} strokeWidth={1} />
                                    ))}
                                    <span className="text-[11px] font-sans text-stone-500 ml-2">
                                        {product.stars !== undefined ? product.stars : 5}/5 - Qualité Premium
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-sans text-stone-500">
                                    <Truck className="w-3.5 h-3.5" /> Livraison Express
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mb-8">
                                <p className="font-serif text-3xl text-stone-900 tracking-wide">
                                    {product.price.toLocaleString()} <span className="text-lg text-stone-400 font-sans tracking-widest">{product.currency || 'MAD'}</span>
                                </p>
                                <p className="text-[11px] font-sans text-stone-400 uppercase tracking-wider">
                                    Paiement à la réception. Sans avance.
                                </p>
                            </div>
                        </div>

                        {/* Stock Visualization */}
                        {product.is_limited_edition ? (() => {
                            const total = product.total_edition || 10;
                            const available = dynamicStock;
                            const percentage = Math.max(5, (available / total) * 100);
                            
                            return (
                                <div className="mb-10 p-5 bg-[#F9F8F6] border border-stone-200/50 rounded-sm">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-sans text-[11px] uppercase tracking-wider text-stone-600 font-medium">
                                            Disponibilité
                                        </span>
                                        <span className="font-sans text-[11px] text-[#D4AF37] font-semibold">
                                            Plus que {available} pièce{available > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-stone-200/60 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-[#D4AF37]"
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-400 mt-3 font-sans tracking-wide">
                                        Sur une édition exclusive de {total} pièces.
                                    </p>
                                </div>
                            );
                        })() : null}

                        {/* Available Colors */}
                        {product.hasColors && product.colors?.length > 0 && (
                            <div className="mb-10">
                                <span className="font-sans text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-4 block">
                                    Nuances
                                </span>
                                <div className="flex flex-wrap items-center gap-5">
                                    {product.colors.map(c => (
                                        <div 
                                            key={c.name} 
                                            onClick={() => handleFieldChange('color', c.name)}
                                            className="flex flex-col items-center gap-2 group cursor-pointer"
                                        >
                                            <div 
                                                className={`w-8 h-8 rounded-full border transition-all duration-300 p-[3px] ${formData.color === c.name ? 'border-[#D4AF37] scale-110' : 'border-stone-200 group-hover:border-[#D4AF37]'}`}
                                            >
                                                <div 
                                                    className="w-full h-full rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: c.hex || '#000000' }}
                                                >
                                                    {formData.color === c.name && (
                                                        <Check className={`w-3.5 h-3.5 ${isLightColor(c.hex) ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`font-sans text-[9px] uppercase tracking-wider transition-colors ${formData.color === c.name ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>
                                                {c.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-10">
                                <span className="font-sans text-[11px] uppercase tracking-wider text-stone-600 font-medium mb-4 block">
                                    Tailles Disponibles
                                </span>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {product.sizes.map(size => {
                                        const fullSizeName = SIZE_LABELS[size] || size;
                                        return (
                                            <button 
                                                key={size}
                                                onClick={() => handleFieldChange('size', fullSizeName)}
                                                className={`px-4 py-2 border text-[10px] uppercase font-sans tracking-widest rounded-sm transition-all duration-300 ${
                                                    formData.size === fullSizeName 
                                                        ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-stone-900 font-medium' 
                                                        : 'border-stone-200 text-stone-600 bg-white hover:border-[#D4AF37]/50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                                {formData.size && formData.size.includes('(') && (
                                    <div className="text-[11px] text-stone-500 font-sans tracking-wide mb-3">
                                        Dimensions : {formData.size.split('(')[1].replace(')', '')}
                                    </div>
                                )}
                                <a 
                                    href={`https://wa.me/212709555824?text=${encodeURIComponent(`Bonjour Maison Lhema, j'ai besoin d'aide pour choisir ma taille pour l'article ${product?.name || ''}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-[#D4AF37] font-sans tracking-wide hover:text-[#b5952f] transition-colors underline underline-offset-4 decoration-[#D4AF37]/30 hover:decoration-[#D4AF37]"
                                >
                                    Besoin d'aide pour choisir votre taille ? Contactez-nous
                                </a>
                            </div>
                        )}

                        {/* Inline Checkout Form */}
                        {isProductAvailable ? (
                            <div className="mb-12 bg-white p-6 border border-stone-100 rounded-sm shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                                <h3 className="font-serif text-xl mb-4 text-stone-900">Finaliser la Commande</h3>
                                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                Nom Complet
                                            </label>
                                            <input
                                                type="text"
                                                className={inputClass('name')}
                                                value={formData.name}
                                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                            />
                                            {errors.name && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] mt-1.5 font-sans">
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                Ville
                                            </label>
                                            <input
                                                type="text"
                                                className={inputClass('city')}
                                                value={formData.city}
                                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                            />
                                            {errors.city && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] mt-1.5 font-sans">
                                                    {errors.city}
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                            Numéro WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="ex: 0612345678"
                                            className={inputClass('whatsapp')}
                                            value={formData.whatsapp}
                                            onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                                        />
                                        {errors.whatsapp && (
                                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-[10px] mt-1.5 font-sans">
                                                {errors.whatsapp}
                                            </motion.p>
                                        )}
                                    </div>

                                    {product.is_limited_edition && (
                                        <div>
                                            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                Vos Mensurations (Optionnel)
                                            </label>
                                            <textarea
                                                placeholder="Taille (1m70), Poids (60kg)..."
                                                className={`${inputClass('mensurations')} resize-none`}
                                                value={formData.mensurations}
                                                onChange={(e) => handleFieldChange('mensurations', e.target.value)}
                                                rows="2"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <p className="text-[10px] text-stone-500 font-sans text-center tracking-widest uppercase mb-4">
                                            {product?.is_limited_edition 
                                                ? "Un acompte sera requis pour lancer la confection."
                                                : "Paiement à la livraison. Sans avance."
                                            }
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#111111] text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#222222] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm"
                                        >
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Traitement en cours...
                                                </>
                                            ) : "VALIDER MA COMMANDE"}
                                        </button>
                                    </div>
                                </form>
                                {product.is_limited_edition && (
                                    <div className="text-center mt-5">
                                        <button
                                            onClick={handleEssayagePriveClick}
                                            className="text-[11px] text-stone-500 font-sans tracking-wide hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
                                        >
                                            Essayage privé à domicile (Casablanca / Rabat)
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mb-12">
                                <div className="w-full py-4 px-6 font-sans text-xs tracking-[0.2em] font-medium uppercase bg-stone-200 text-stone-400 cursor-not-allowed rounded-sm text-center">
                                    {product.isAvailable === false ? "Indisponible" : "Épuisé"}
                                </div>
                            </div>
                        )}

                        {/* Description & Features */}
                        <div className="mb-12 pt-8 border-t border-stone-200/60">
                            {product.description_title && (
                                <div className="mb-10">
                                    <h3 className="font-serif text-xl mb-4 text-stone-900">{product.description_title}</h3>
                                    <p className="text-stone-600 font-sans text-[13px] leading-relaxed">
                                        {product.description_subtitle}
                                    </p>
                                </div>
                            )}

                            {product.features && product.features.length > 0 && (
                                <div className="mb-10">
                                    {/* Section header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                                        <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium whitespace-nowrap">
                                            Détails de la Pièce
                                        </h4>
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                                    </div>

                                    {/* Feature cards */}
                                    <div className="space-y-4">
                                        {product.features.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-50px" }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                className="group relative bg-white border border-stone-100 hover:border-[#D4AF37]/30 rounded-sm p-5 transition-all duration-500 hover:shadow-[0_4px_20px_-4px_rgba(212,175,55,0.1)]"
                                            >
                                                <div className="flex gap-4">
                                                    {/* Numbered badge */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4AF37]/5">
                                                            <span className="font-serif text-[11px] text-[#D4AF37]">
                                                                {String(idx + 1).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-sans text-[12px] uppercase tracking-[0.15em] text-stone-900 font-semibold mb-2 group-hover:text-[#8B7535] transition-colors duration-300">
                                                            {feature.title}
                                                        </h5>
                                                        <p className="font-sans text-[12px] text-stone-500 leading-[1.8] group-hover:text-stone-600 transition-colors duration-300">
                                                            {feature.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Subtle bottom accent line */}
                                                <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/0 group-hover:via-[#D4AF37]/20 to-transparent transition-all duration-700"></div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Policies Accordion */}
                        <div className="w-full pt-4">
                            {/* Section header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                                <h4 className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium whitespace-nowrap">
                                    L'Expérience Lhema
                                </h4>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                            </div>

                            <div className="space-y-3">
                                {policies.map((policy, idx) => {
                                    const isOpen = openAccordion === idx;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`relative bg-white border rounded-sm transition-all duration-500 overflow-hidden ${
                                                isOpen 
                                                    ? 'border-[#D4AF37]/30 shadow-[0_4px_20px_-4px_rgba(212,175,55,0.1)]' 
                                                    : 'border-stone-100 hover:border-[#D4AF37]/20'
                                            }`}
                                        >
                                            {/* Gold accent bar on left */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4AF37] transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>

                                            <button 
                                                onClick={() => toggleAccordion(idx)}
                                                className="w-full flex items-center justify-between px-5 py-4 focus:outline-none group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                                        isOpen 
                                                            ? 'border-[#D4AF37]/60 bg-[#D4AF37]/5' 
                                                            : 'border-stone-200 group-hover:border-[#D4AF37]/40'
                                                    }`}>
                                                        {React.cloneElement(policy.icon, { 
                                                            className: `w-3.5 h-3.5 transition-colors duration-300 ${
                                                                isOpen ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:text-[#D4AF37]'
                                                            }` 
                                                        })}
                                                    </div>
                                                    <span className={`font-sans text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors duration-300 ${
                                                        isOpen ? 'text-stone-900' : 'text-stone-600 group-hover:text-stone-900'
                                                    }`}>
                                                        {policy.title}
                                                    </span>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                                    isOpen 
                                                        ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5 rotate-45' 
                                                        : 'border-stone-200 group-hover:border-[#D4AF37]/30'
                                                }`}>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-colors duration-300 ${isOpen ? 'text-[#D4AF37]' : 'text-stone-400'}`}>
                                                        <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.2" />
                                                        <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" />
                                                    </svg>
                                                </div>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 pl-[4.25rem]">
                                                            <p className="font-sans text-[12px] text-stone-500 leading-[1.8]">
                                                                {policy.content}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

        </main>
    );
};

export default ProductDetail;
