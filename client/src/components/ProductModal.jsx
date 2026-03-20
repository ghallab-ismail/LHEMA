import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Image as ImageIcon, AlertCircle, Star, ChevronDown, ChevronUp, Upload, Loader2 } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Sur Mesure'];

const defaultForm = {
    name: '',
    description: '',
    price: '',
    currency: 'MAD',
    category: 'femme',
    images: [],
    sizes: [],
    stars: 5,
    stock: 10,
    total_edition: 10,
    is_limited_edition: true,
    description_title: '',
    description_subtitle: '',
    features: [{ title: '', desc: '' }],
    isAvailable: true,
};

const ProductModal = ({ isOpen, onClose, mode, initialData, onSubmit }) => {
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const firstInputRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    price: initialData.price ?? '',
                    currency: initialData.currency || 'MAD',
                    category: initialData.category || 'femme',
                    images: initialData.images?.length > 0 ? initialData.images : [],
                    sizes: initialData.sizes || [],
                    stars: initialData.stars !== undefined ? initialData.stars : 5,
                    stock: initialData.stock !== undefined ? initialData.stock : 10,
                    total_edition: initialData.total_edition !== undefined ? initialData.total_edition : 10,
                    is_limited_edition: initialData.is_limited_edition !== undefined ? initialData.is_limited_edition : true,
                    description_title: initialData.description_title || '',
                    description_subtitle: initialData.description_subtitle || '',
                    features: initialData.features?.length > 0 ? initialData.features : [{ title: '', desc: '' }],
                    isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
                });
                setShowAdvanced(true);
            } else {
                setFormData(defaultForm);
                setShowAdvanced(false);
            }
            setErrors({});
            setIsSubmitting(false);
            setIsUploading(false);
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [isOpen, mode, initialData]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0)
            newErrors.price = 'Valid price is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        try {
            const cleanedFeatures = formData.features.filter(f => f.title.trim() !== '' || f.desc.trim() !== '');
            await onSubmit({
                ...formData,
                price: Number(formData.price),
                stars: Number(formData.stars),
                stock: Number(formData.stock),
                total_edition: Number(formData.total_edition),
                features: cleanedFeatures,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Upload files to the server
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setErrors(prev => ({ ...prev, images: undefined }));

        try {
            const formDataUpload = new FormData();
            for (let i = 0; i < files.length; i++) {
                formDataUpload.append('images', files[i]);
            }

            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token,
                },
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...data.urls],
                }));
            } else {
                const errData = await response.json();
                setErrors(prev => ({ ...prev, images: errData.msg || 'Upload failed' }));
            }
        } catch (err) {
            console.error('Upload error:', err);
            setErrors(prev => ({ ...prev, images: 'Upload failed. Please try again.' }));
        } finally {
            setIsUploading(false);
            // Reset file input so same file can be re-uploaded
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    // Feature handlers
    const handleFeatureChange = (index, field, value) => {
        const updated = [...formData.features];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, features: updated });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, { title: '', desc: '' }] });
    };

    const removeFeature = (index) => {
        const updated = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: updated.length > 0 ? updated : [{ title: '', desc: '' }] });
    };

    const inputClass = (field) =>
        `w-full bg-[#1a1a1a] border ${errors[field] ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-3 px-4 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors`;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative bg-[#0a0a0a] w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-white/10 overflow-y-auto max-h-[92vh]"
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-serif text-white mb-1">
                            {mode === 'create' ? 'Add Product' : 'Edit Product'}
                        </h2>
                        <p className="text-stone-500 text-xs tracking-widest uppercase">
                            {mode === 'create' ? 'New Collection Item' : 'Update Product Details'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name + Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Product Name *
                                </label>
                                <input
                                    ref={firstInputRef}
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={inputClass('name')}
                                    placeholder="e.g. Veste-Cape L'Éclat de Lhema"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Price (MAD) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className={inputClass('price')}
                                    placeholder="e.g. 14500"
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.price}</p>}
                            </div>
                        </div>

                        {/* Category + Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Category *
                                </label>
                                <div className="flex gap-3">
                                    {['femme', 'homme'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                                                formData.category === cat
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-stone-400 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            {cat === 'femme' ? '♀ Femme' : '♂ Homme'}
                                        </button>
                                    ))}
                                </div>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Availability
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                                    className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                                        formData.isAvailable
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${formData.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    {formData.isAvailable ? 'Available' : 'Unavailable'}
                                </button>
                            </div>
                        </div>

                        {/* Stars + Stock + Edition */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Rating (Stars)
                                </label>
                                <div className="flex items-center gap-1 bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, stars: s })}
                                            className="transition-colors"
                                        >
                                            <Star
                                                className={`w-5 h-5 ${s <= formData.stars ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-600'}`}
                                                strokeWidth={1}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs text-stone-500 ml-2">{formData.stars}/5</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Stock (Pièces)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className={inputClass('')}
                                    placeholder="e.g. 10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                    Total Édition
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.total_edition}
                                    onChange={(e) => setFormData({ ...formData, total_edition: e.target.value })}
                                    className={inputClass('')}
                                    placeholder="e.g. 10"
                                />
                            </div>
                        </div>

                        {/* Limited Edition Toggle */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, is_limited_edition: !formData.is_limited_edition })}
                                className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                                    formData.is_limited_edition
                                        ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                                        : 'bg-white/5 text-stone-400 border-white/10'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${formData.is_limited_edition ? 'bg-[#D4AF37]' : 'bg-stone-500'}`} />
                                {formData.is_limited_edition ? 'Édition Limitée ✓' : 'Standard Edition'}
                            </button>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-3 font-medium">
                                Available Sizes
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => toggleSize(size)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider transition-all border ${
                                            formData.sizes.includes(size)
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-stone-400 border-white/10 hover:border-white/30'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Images - File Upload */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-3 font-medium">
                                Product Images *
                            </label>

                            {/* Upload Area */}
                            <div
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                    isUploading
                                        ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5'
                                        : errors.images
                                            ? 'border-red-500/30 hover:border-red-500/50 bg-red-500/5'
                                            : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                                        <p className="text-sm text-[#D4AF37]">Uploading images...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-stone-500" />
                                        <p className="text-sm text-stone-400">
                                            Click to upload images from your laptop
                                        </p>
                                        <p className="text-[10px] text-stone-600 uppercase tracking-wider">
                                            JPEG, PNG, WebP • Max 10MB per file
                                        </p>
                                    </div>
                                )}
                            </div>

                            {errors.images && (
                                <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                                    <AlertCircle className="w-3 h-3" />{errors.images}
                                </p>
                            )}

                            {/* Image Previews */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                            <img
                                                src={url}
                                                alt={`Product image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.opacity = '0.3';
                                                }}
                                            />
                                            {/* Delete overlay */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-400" />
                                            </button>
                                            {/* Image number badge */}
                                            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                                                {index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Savoir-Faire & Composition Section */}
                        <div className="border-t border-white/5 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="text-sm font-serif text-[#D4AF37] uppercase tracking-widest">
                                    Savoir-Faire & Composition
                                </span>
                                {showAdvanced ? (
                                    <ChevronUp className="w-4 h-4 text-stone-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-stone-500" />
                                )}
                            </button>

                            {showAdvanced && (
                                <div className="space-y-6">
                                    {/* Description Title */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                            Description Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.description_title}
                                            onChange={(e) => setFormData({ ...formData, description_title: e.target.value })}
                                            className={inputClass('')}
                                            placeholder="e.g. L'Élégance Exclusive : Votre Pièce d'Exception"
                                        />
                                    </div>

                                    {/* Description Subtitle */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">
                                            Description Subtitle
                                        </label>
                                        <textarea
                                            value={formData.description_subtitle}
                                            onChange={(e) => setFormData({ ...formData, description_subtitle: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                            placeholder='e.g. "Découvrez le raffinement absolu avec une création conçue pour vous faire sentir unique."'
                                            rows={2}
                                        />
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-3 font-medium">
                                            Features / Composition Details
                                        </label>
                                        <div className="space-y-4">
                                            {formData.features.map((feature, index) => (
                                                <div key={index} className="bg-[#111] border border-white/5 rounded-xl p-4 relative">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[10px] text-stone-600 uppercase tracking-widest font-medium">
                                                            Feature {index + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFeature(index)}
                                                            disabled={formData.features.length === 1 && !feature.title.trim() && !feature.desc.trim()}
                                                            className="p-1.5 rounded-lg text-stone-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={feature.title}
                                                        onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors mb-2 font-medium"
                                                        placeholder="e.g. Le Cachemire Royal"
                                                    />
                                                    <textarea
                                                        value={feature.desc}
                                                        onChange={(e) => handleFeatureChange(index, 'desc', e.target.value)}
                                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                                        placeholder="Description of this feature..."
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="flex items-center gap-2 text-xs text-[#D4AF37] hover:text-[#e5c548] transition-colors px-1 py-1"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add another feature
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="flex-1 py-3 px-4 rounded-lg bg-white text-black hover:bg-stone-200 transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductModal;
