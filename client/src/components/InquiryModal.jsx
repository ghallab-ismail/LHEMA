import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const InquiryModal = ({ isOpen, onClose, mode, initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        city: '',
        size: 'M (42-45)',
        productName: 'The Signature Cape',
        status: 'pending'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    whatsapp: initialData.whatsapp || '',
                    city: initialData.city || '',
                    size: initialData.size || 'M (42-45)',
                    productName: initialData.productName || 'The Signature Cape',
                    status: initialData.status || 'pending'
                });
            } else {
                setFormData({
                    name: '',
                    whatsapp: '',
                    city: '',
                    size: 'M (42-45)',
                    productName: 'The Signature Cape',
                    status: 'pending'
                });
            }
            setErrors({});
        }
    }, [isOpen, mode, initialData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSubmit(formData);
    };

    const inputClass = (field) =>
        `w-full bg-[#1a1a1a] border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors`;

    const selectClass = "w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[#0a0a0a] w-full max-w-xl p-8 rounded-2xl shadow-2xl border border-white/10 overflow-y-auto max-h-[90vh]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-8">
                        <h2 className="text-2xl font-serif text-white mb-2">
                            {mode === 'create' ? 'New Request' : 'Edit Request'}
                        </h2>
                        <p className="text-stone-500 text-xs tracking-widest uppercase">
                            {mode === 'create' ? 'Manual Entry' : 'Update Client Information'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Client Name */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Client Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass('name')}
                                    placeholder="Enter full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className={inputClass('whatsapp')}
                                    placeholder="e.g. 0612345678"
                                />
                                {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className={inputClass('city')}
                                    placeholder="Enter town/city"
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>

                            {/* Status (Only show on Edit) */}
                            {mode === 'edit' && (
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className={selectClass}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="no answer">No Answer</option>
                                            <option value="wrong number">Wrong Number</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">▼</div>
                                    </div>
                                </div>
                            )}

                            {/* Product Name */}
                            <div className={mode === 'create' ? "md:col-span-2" : ""}>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    className={inputClass('productName')}
                                    placeholder="Enter product name"
                                />
                                {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                            </div>

                            {/* Size */}
                            <div className={mode === 'create' ? "md:col-span-2" : ""}>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Size
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        className={selectClass}
                                    >
                                        <option value="M (42-45)">M (42-45)</option>
                                        <option value="L (46-49)">L (46-49)</option>
                                        <option value="XL (50-53)">XL (50-53)</option>
                                        <option value="XXL (54-57)">XXL (54-57)</option>
                                        <option value="Sur Mesure">Sur Mesure</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-xs">▼</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-4 rounded-lg bg-white text-black hover:bg-stone-200 transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                {mode === 'create' ? 'Create Request' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InquiryModal;
