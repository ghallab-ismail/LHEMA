import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Search,
    Check,
    Clock,
    Loader2,
    Package,
    Scissors,
    Sparkles,
    Truck,
    ClipboardCheck,
    Gem,
    ArrowLeft,
    Gift
} from 'lucide-react';

const stepIcons = {
    'Demande Reçue': ClipboardCheck,
    'Sélection des Tissus': Gem,
    'Patron & Coupe': Scissors,
    'Confection Artisanale': Sparkles,
    'Finitions & Détails': Sparkles,
    'Contrôle Qualité': Search,
    'Emballage Premium': Gift,
    'Expédition': Truck,
};

const getStepIcon = (title) => {
    return stepIcons[title] || Package;
};

const OrderTracking = () => {
    const [searchParams] = useSearchParams();
    const [code, setCode] = useState(searchParams.get('code') || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (searchParams.get('code')) {
            handleTrack(searchParams.get('code'));
        }
    }, []);

    const handleTrack = async (trackingCode) => {
        const codeToSearch = (trackingCode || code).trim().toUpperCase();
        if (!codeToSearch) {
            setError('Veuillez entrer votre code de suivi.');
            return;
        }

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/track/${codeToSearch}`);

            if (response.ok) {
                const data = await response.json();
                setOrder(data);
                setError('');
            } else {
                setOrder(null);
                setError('Aucune commande trouvée avec ce code. Veuillez vérifier et réessayer.');
            }
        } catch (err) {
            console.error('Tracking error:', err);
            setOrder(null);
            setError('Erreur de connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTrack();
    };

    const completedCount = order?.craftingSteps?.filter(s => s.status === 'completed').length || 0;
    const totalSteps = order?.craftingSteps?.length || 0;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
        <div className="min-h-screen bg-lhema-cream">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-100/80 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-lhema-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto px-6 pt-32 pb-16 text-center">
                    {/* Back link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-lhema-black transition-colors mb-12"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Retour
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-lhema-gold mb-4">
                            Maison Lhema
                        </p>
                        <h1 className="font-serif text-4xl md:text-5xl text-lhema-black mb-4">
                            Suivi de Commande
                        </h1>
                        <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-md mx-auto mb-12">
                            Suivez chaque étape de la confection artisanale de votre pièce unique.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={handleSubmit}
                        className="relative max-w-md mx-auto"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                                placeholder="Entrez votre code (ex: LH-A3K7B2)"
                                className="w-full bg-white border border-stone-200 rounded-none px-6 py-4 pr-14 text-center font-serif text-lg tracking-[0.15em] text-lhema-black placeholder:text-stone-300 placeholder:text-sm placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:border-lhema-gold focus:ring-1 focus:ring-lhema-gold/20 transition-all shadow-sm"
                                id="tracking-code-input"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-lhema-black text-white hover:bg-stone-800 transition-colors disabled:opacity-50"
                                id="tracking-submit-btn"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </motion.form>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="text-red-500 text-xs font-sans mt-4"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Order Results */}
            <AnimatePresence mode="wait">
                {order && (
                    <motion.div
                        key="order-result"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto px-6 pb-24"
                    >
                        {/* Order Header Card */}
                        <div className="bg-white border border-stone-200/60 p-8 md:p-10 mb-8 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                <div>
                                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2">
                                        Commande
                                    </p>
                                    <h2 className="font-serif text-2xl text-lhema-black mb-1">
                                        {order.trackingCode}
                                    </h2>
                                    <p className="font-sans text-sm text-stone-500">
                                        {order.productName}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start md:items-end gap-2">
                                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400">
                                        Progression
                                    </span>
                                    {/* Circular Progress */}
                                    <div className="relative w-20 h-20">
                                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r="34"
                                                stroke="#e7e5e4"
                                                strokeWidth="3"
                                                fill="none"
                                            />
                                            <motion.circle
                                                cx="40"
                                                cy="40"
                                                r="34"
                                                stroke="#C2B280"
                                                strokeWidth="3"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 34}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                                                animate={{
                                                    strokeDashoffset: 2 * Math.PI * 34 * (1 - progressPercent / 100)
                                                }}
                                                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="font-serif text-lg text-lhema-black">
                                                {progressPercent}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-stone-100">
                                {[
                                    { label: 'Client', value: order.customerName },
                                    { label: 'Produit', value: order.productName },
                                    { label: 'Statut', value: order.status === 'received' ? 'Reçue' : order.status === 'in-progress' ? 'En Confection' : order.status === 'ready' ? 'Prête' : order.status === 'shipped' ? 'Expédiée' : 'Livrée' },
                                    { label: 'Date', value: new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-1">{item.label}</p>
                                        <p className="font-sans text-sm text-lhema-black font-medium">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {order.estimatedDelivery && (
                                <div className="mt-6 pt-6 border-t border-stone-100">
                                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-1">Livraison Estimée</p>
                                    <p className="font-sans text-sm text-lhema-gold font-medium">
                                        {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-stone-200/60 p-8 md:p-10 shadow-sm">
                            <h3 className="font-serif text-xl text-lhema-black mb-2">
                                Parcours de Confection
                            </h3>
                            <p className="font-sans text-xs text-stone-400 mb-10 tracking-wide">
                                Chaque pièce est confectionnée à la main avec le plus grand soin.
                            </p>

                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-stone-200" />

                                {/* Animated completed line */}
                                <motion.div
                                    className="absolute left-[19px] top-0 w-px bg-gradient-to-b from-lhema-gold to-lhema-gold/40"
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: totalSteps > 0
                                            ? `${((completedCount - 0.5) / totalSteps) * 100}%`
                                            : '0%'
                                    }}
                                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                                />

                                <div className="space-y-0">
                                    {order.craftingSteps.map((step, index) => {
                                        const IconComponent = getStepIcon(step.title);
                                        const isCompleted = step.status === 'completed';
                                        const isInProgress = step.status === 'in-progress';
                                        const isPending = step.status === 'pending';

                                        return (
                                            <motion.div
                                                key={step._id || index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                                className={`relative flex items-start gap-5 py-5 ${index === order.craftingSteps.length - 1 ? '' : ''}`}
                                            >
                                                {/* Step indicator */}
                                                <div className="relative z-10 flex-shrink-0">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 300 }}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                            isCompleted
                                                                ? 'bg-lhema-gold/10 border-2 border-lhema-gold text-lhema-gold'
                                                                : isInProgress
                                                                    ? 'bg-blue-50 border-2 border-blue-400 text-blue-500'
                                                                    : 'bg-stone-50 border-2 border-stone-200 text-stone-300'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <Check className="w-4.5 h-4.5" strokeWidth={2.5} />
                                                        ) : isInProgress ? (
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                                            >
                                                                <Loader2 className="w-4.5 h-4.5" />
                                                            </motion.div>
                                                        ) : (
                                                            <IconComponent className="w-4 h-4" />
                                                        )}
                                                    </motion.div>

                                                    {/* Pulse animation for in-progress */}
                                                    {isInProgress && (
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-2 border-blue-400"
                                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                                                        />
                                                    )}
                                                </div>

                                                {/* Step content */}
                                                <div className={`flex-1 pb-1 ${isPending ? 'opacity-40' : ''}`}>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className={`font-serif text-base ${
                                                            isCompleted ? 'text-lhema-black' : isInProgress ? 'text-blue-600' : 'text-stone-400'
                                                        }`}>
                                                            {step.title}
                                                        </h4>
                                                        {isInProgress && (
                                                            <span className="font-sans text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-blue-50 text-blue-500 border border-blue-100 rounded-full font-medium">
                                                                En Cours
                                                            </span>
                                                        )}
                                                    </div>
                                                    {step.description && (
                                                        <p className="font-sans text-xs text-stone-500 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    )}
                                                    {isCompleted && step.completedAt && (
                                                        <p className="font-sans text-[10px] text-lhema-gold mt-1.5 flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(step.completedAt).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer note */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-center font-sans text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-8"
                        >
                            Votre pièce est confectionnée avec amour par nos artisans
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state when searched but no result */}
            {searched && !order && !loading && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-400 font-sans text-sm">
                        Aucune commande trouvée.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default OrderTracking;
