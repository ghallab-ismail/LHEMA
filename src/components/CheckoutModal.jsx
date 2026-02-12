import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', whatsapp: '', city: '', size: 'Standard' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send data to backend
        setStep(2);
        setTimeout(() => {
            onClose(); // Close after success message
            setStep(1);
            setFormData({ name: '', whatsapp: '' });
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-md p-8 md:p-12 shadow-2xl border border-stone-100"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-stone-400 hover:text-black transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {step === 1 ? (
                            <div className="text-center">
                                <h3 className="font-serif text-2xl mb-2 text-black">Concierge Request</h3>
                                <p className="font-sans text-xs text-stone-600 mb-8 tracking-wide">
                                    To acquire "{product?.name}", please provide your details.
                                    Our private client team will contact you.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div>
                                        <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-transparent border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black transition-colors font-serif placeholder-stone-300"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                            WhatsApp Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-transparent border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black transition-colors font-serif placeholder-stone-300"
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-transparent border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black transition-colors font-serif placeholder-stone-300"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] mb-2 text-stone-800 font-semibold">
                                                Size
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full bg-transparent border-b border-stone-300 py-2 text-black focus:outline-none focus:border-black transition-colors font-serif appearance-none cursor-pointer"
                                                    value={formData.size}
                                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                                >
                                                    <option value="Standard">Standard</option>
                                                    <option value="Petite">Petite</option>
                                                    <option value="Tall">Tall</option>
                                                    <option value="Custom">Custom</option>
                                                </select>
                                                {/* Custom Chevron for cleaner look */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[10px]">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-[10px] text-stone-500 text-center mb-6 font-sans italic">
                                            Payment linked upon personal delivery.
                                        </p>

                                        <button type="submit" className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-stone-800 transition-colors shadow-lg">
                                            Request Acquisition
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="font-serif text-2xl mb-4 text-black">Request Received</h3>
                                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                                    Thank you, {formData.name}. <br />
                                    A private client advisor will reach out shortly on WhatsApp.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
