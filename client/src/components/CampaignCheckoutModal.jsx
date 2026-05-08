import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CampaignCheckoutModal = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', whatsapp: '', city: '', size: 'M (42-45)' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const SIZE_LABELS = {
        'XS': 'XS',
        'S': 'S',
        'M': 'M (42-45)',
        'L': 'L (46-49)',
        'XL': 'XL (50-53)',
        'XXL': 'XXL (54-57)'
    };

    const getAvailableSizes = () => {
        if (!product?.sizes || product.sizes.length === 0) {
            return ['M (42-45)', 'L (46-49)', 'XL (50-53)', 'XXL (54-57)'];
        }
        return product.sizes.filter(s => s !== 'Sur Mesure').map(s => SIZE_LABELS[s] || s);
    };

    const availableSizes = getAvailableSizes();

    React.useEffect(() => {
        if (isOpen && availableSizes.length > 0) {
            if (!availableSizes.includes(formData.size)) {
                setFormData(prev => ({ ...prev, size: availableSizes[0] }));
            }
        }
    }, [isOpen, product, availableSizes]);

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

    const handleCloseModal = () => {
        onClose();
        setStep(1);
        setFormData({ name: '', whatsapp: '', city: '', size: availableSizes[0] || 'M (42-45)' });
        setErrors({});
        setTrackingCode('');
        setCopied(false);
        setEmail('');
        setEmailSubmitted(false);
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(trackingCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const el = document.createElement('textarea');
            el.value = trackingCode;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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
            const productNameToSend = product?.name || "The Signature Cape";

            const finalSize = formData.size;
            
            const sizeWithMensurations = finalSize;

            // Create inquiry (existing flow)
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
                setTrackingCode(orderData.trackingCode);
                setStep(2);
                setErrors({});
            } else {
                console.error('Submission failed');
            }
            setSubmitting(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitting(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/orders/track/${trackingCode}/email`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setEmailSubmitted(true);
        } catch (error) {
            console.error('Error saving email:', error);
        }
    };

    const inputClass = (field) =>
        `w-full bg-transparent border-b py-2 text-black focus:outline-none transition-colors font-serif placeholder-stone-300 ${errors[field] ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-black'
        }`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-md p-8 md:p-12 shadow-2xl border border-stone-100"
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-stone-400 hover:text-black transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {step === 1 ? (
                            <div className="text-center">
                                <h3 className="font-serif text-2xl mb-2 text-black">Finaliser l'Acquisition</h3>
                                <p className="font-sans text-xs text-stone-500 mb-8 tracking-wide px-2">
                                    Veuillez renseigner vos coordonnées pour finaliser votre commande.
                                </p>

                                <form onSubmit={handleSubmit} noValidate className="space-y-6 text-left">
                                    <div className="grid grid-cols-2 gap-6">
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

                                    <div className={`grid gap-6 ${availableSizes.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
                                        
                                        {availableSizes.length > 1 && (
                                            <div>
                                                <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                    Taille
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-transparent border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black transition-colors font-serif appearance-none cursor-pointer"
                                                        value={formData.size}
                                                        onChange={(e) => handleFieldChange('size', e.target.value)}
                                                    >
                                                        {availableSizes.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[10px]">
                                                        ▼
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <p className="text-[10px] text-stone-500 font-sans text-center tracking-widest uppercase mb-4">
                                            Paiement à la livraison
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                {/* Success checkmark */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center"
                                >
                                    <Check className="w-8 h-8 text-emerald-600" />
                                </motion.div>

                                <h3 className="font-serif text-2xl mb-3 text-black">Demande Reçue</h3>
                                <p className="font-sans text-sm text-stone-600 leading-relaxed mb-8">
                                    Merci, {formData.name}. <br />
                                    Un conseiller privé vous contactera bientôt sur WhatsApp.
                                </p>

                                {/* Tracking Code */}
                                {trackingCode && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-stone-50 border border-stone-200 p-6 mb-6"
                                    >
                                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
                                            Votre Code de Suivi
                                        </p>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="font-serif text-2xl text-black tracking-widest">
                                                {trackingCode}
                                            </span>
                                            <button
                                                onClick={handleCopyCode}
                                                className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                                                title="Copier le code"
                                            >
                                                {copied ? (
                                                    <Check className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-stone-400" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="font-sans text-[10px] text-stone-400 mt-3">
                                            Conservez ce code pour suivre la confection de votre pièce.
                                        </p>
                                    </motion.div>
                                )}

                                {/* Email collection */}
                                {!emailSubmitted ? (
                                    <form onSubmit={handleEmailSubmit} className="mb-8 max-w-sm mx-auto">
                                        <p className="font-sans text-xs text-stone-500 mb-3">
                                            Afin de rester au courant de l'avancement, laissez-nous votre email (optionnel) :
                                        </p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="votre@email.com" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="flex-1 bg-transparent border-b border-stone-300 py-2 text-sm text-black focus:outline-none focus:border-black transition-colors"
                                            />
                                            <button 
                                                type="submit"
                                                className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors"
                                            >
                                                Valider
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <motion.p 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-emerald-600 text-xs font-sans mb-8"
                                    >
                                        Merci, votre email est enregistré.
                                    </motion.p>
                                )}

                                <Link
                                    to={`/suivi?code=${trackingCode}`}
                                    onClick={handleCloseModal}
                                    className="inline-block text-xs font-sans uppercase tracking-[0.15em] text-stone-500 hover:text-black transition-colors border-b border-stone-300 hover:border-black pb-1"
                                >
                                    Suivre ma commande →
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CampaignCheckoutModal;
