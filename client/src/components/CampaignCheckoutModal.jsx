import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CampaignCheckoutModal = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', whatsapp: '', city: '', size: 'M (Épaules: 42-45 cm)' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const navigate = useNavigate();

    const SIZE_LABELS = {
        'XS': 'XS',
        'S': 'S',
        'M': 'M (Épaules: 42-45 cm)',
        'L': 'L (Épaules: 46-49 cm)',
        'XL': 'XL (Épaules: 50-53 cm)',
        'XXL': 'XXL (Épaules: 54-57 cm)'
    };

    const getAvailableSizes = () => {
        if (!product?.sizes || product.sizes.length === 0) {
            return ['M (Épaules: 42-45 cm)', 'L (Épaules: 46-49 cm)', 'XL (Épaules: 50-53 cm)', 'XXL (Épaules: 54-57 cm)'];
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
        setFormData({ name: '', whatsapp: '', city: '', size: availableSizes[0] || 'M (Épaules: 42-45 cm)' });
        setErrors({});
        setTrackingCode('');
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
                onClose();
                navigate(`/suivi?code=${orderData.trackingCode}&success=true`);
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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CampaignCheckoutModal;
