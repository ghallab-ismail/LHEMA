import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
    Copy,
    Check,
    Clock,
    Package,
    Loader2,
    Eye,
    Edit3,
    Save,
    GripVertical,
    CheckCircle2,
    AlertCircle,
    MessageCircle,
    Mail
} from 'lucide-react';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);
    const [savingStep, setSavingStep] = useState(null);
    const [showAddStep, setShowAddStep] = useState(null);
    const [newStepTitle, setNewStepTitle] = useState('');
    const [newStepTitleAr, setNewStepTitleAr] = useState('');
    const [newStepDesc, setNewStepDesc] = useState('');
    const [editingStep, setEditingStep] = useState(null);
    const [editStepTitle, setEditStepTitle] = useState('');
    const [editStepTitleAr, setEditStepTitleAr] = useState('');
    const [editStepDesc, setEditStepDesc] = useState('');
    const [toast, setToast] = useState(null);

    const API = import.meta.env.VITE_API_URL;
    const getToken = () => localStorage.getItem('adminToken');

    useEffect(() => {
        fetchOrders();
    }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API}/api/orders`, {
                headers: { 'x-auth-token': getToken() }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (statusFilter !== 'all' && order.status !== statusFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    order.trackingCode?.toLowerCase().includes(q) ||
                    order.customerName?.toLowerCase().includes(q) ||
                    order.productName?.toLowerCase().includes(q) ||
                    order.whatsapp?.toLowerCase().includes(q) ||
                    order.city?.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [orders, searchQuery, statusFilter]);

    const handleCopyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
        } catch {
            const el = document.createElement('textarea');
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleUpdateStep = async (orderId, stepId, updates) => {
        setSavingStep(stepId);
        try {
            const response = await fetch(`${API}/api/orders/${orderId}/steps/${stepId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': getToken() },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
                showToast('Step updated');
            }
        } catch (err) {
            console.error('Error updating step:', err);
            showToast('Error updating step', 'error');
        } finally {
            setSavingStep(null);
        }
    };

    const handleAddStep = async (orderId) => {
        if (!newStepTitle.trim()) return;
        try {
            const response = await fetch(`${API}/api/orders/${orderId}/steps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': getToken() },
                body: JSON.stringify({ 
                    title: newStepTitle, 
                    titleAr: newStepTitleAr,
                    description: newStepDesc 
                })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
                setNewStepTitle('');
                setNewStepTitleAr('');
                setNewStepDesc('');
                setShowAddStep(null);
                showToast('Step added');
            }
        } catch (err) {
            console.error('Error adding step:', err);
            showToast('Error adding step', 'error');
        }
    };

    const handleDeleteStep = async (orderId, stepId) => {
        try {
            const response = await fetch(`${API}/api/orders/${orderId}/steps/${stepId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': getToken() }
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
                showToast('Step removed');
            }
        } catch (err) {
            console.error('Error deleting step:', err);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            const response = await fetch(`${API}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': getToken() }
            });

            if (response.ok) {
                setOrders(prev => prev.filter(o => o._id !== orderId));
                if (expandedOrder === orderId) setExpandedOrder(null);
                showToast('Order deleted');
            }
        } catch (err) {
            console.error('Error deleting order:', err);
        }
    };

    const handleUpdateOrderField = async (orderId, field, value) => {
        try {
            const response = await fetch(`${API}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': getToken() },
                body: JSON.stringify({ [field]: value })
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updatedOrder : o));
                showToast('Order updated');
            }
        } catch (err) {
            console.error('Error updating order:', err);
        }
    };

    const handleSaveEditStep = async (orderId, stepId) => {
        await handleUpdateStep(orderId, stepId, { 
            title: editStepTitle, 
            titleAr: editStepTitleAr,
            description: editStepDesc 
        });
        setEditingStep(null);
    };

    const handleWhatsAppNotify = (order, step = null) => {
        if (!order.whatsapp) {
            showToast('No WhatsApp number provided for this customer');
            return;
        }
        
        // Ensure phone number has international format (defaulting to MA +212 if starts with 0)
        let phoneNumber = order.whatsapp.replace(/\D/g, '');
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '212' + phoneNumber.substring(1);
        }
        
        const trackingLink = `${window.location.origin}/suivi?code=${order.trackingCode}`;
        const productText = order.productName ? `de la pièce ${order.productName}` : 'de votre pièce';
        
        let message = '';
        if (!step || step.title.includes('Demande Reçue')) {
            message = `Bonjour ${order.customerName || 'Cher Client'},\n\nVotre commande ${productText} a bien été enregistrée et confirmée.\n\nVoici votre code de suivi : *${order.trackingCode}*\n\nVous pouvez suivre l'avancement de la confection de votre pièce sur ce lien :\n${trackingLink}\n\nL'équipe Maison Lhema.`;
        } else {
            message = `Bonjour ${order.customerName || 'Cher Client'},\n\nBonne nouvelle ! Votre commande ${productText} a franchi une nouvelle étape : *${step.title}*.\n\nVous pouvez suivre les détails ici :\n${trackingLink}\n\nL'équipe Maison Lhema.`;
        }
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const handleEmailNotify = (e, order, step = null) => {
        e.stopPropagation();
        if (!order.email) {
            showToast('No email address provided for this customer');
            return;
        }

        const trackingLink = `${window.location.origin}/suivi?code=${order.trackingCode}`;
        const productText = order.productName ? `de la pièce ${order.productName}` : 'de votre pièce';
        const subject = !step || step.title.includes('Demande Reçue') 
            ? `Confirmation de votre commande Maison Lhema - ${order.trackingCode}`
            : `Mise à jour de votre commande Maison Lhema - ${step.title}`;
        
        let message = '';
        if (!step || step.title.includes('Demande Reçue')) {
            message = `Bonjour ${order.customerName || 'Cher Client'},\n\nVotre commande ${productText} a bien été enregistrée et confirmée.\n\nVoici votre code de suivi : ${order.trackingCode}\n\nVous pouvez suivre l'avancement de la confection de votre pièce sur ce lien :\n${trackingLink}\n\nL'équipe Maison Lhema.`;
        } else {
            message = `Bonjour ${order.customerName || 'Cher Client'},\n\nVotre commande ${productText} vient de franchir une nouvelle étape importante : ${step.title}.\n\nVous pouvez consulter l'état détaillé de la confection ici :\n${trackingLink}\n\nL'équipe Maison Lhema.`;
        }
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedMessage = encodeURIComponent(message);
        
        const mailtoLink = `mailto:${order.email}?subject=${encodedSubject}&body=${encodedMessage}`;
        const a = document.createElement('a');
        a.href = mailtoLink;
        a.target = '_top';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'received': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'ready': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'shipped': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-stone-500/10 text-stone-500 border-stone-500/20';
        }
    };

    const getStepStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500';
            case 'in-progress': return 'bg-blue-500';
            default: return 'bg-stone-600';
        }
    };

    const statusLabels = {
        'received': 'Reçue',
        'in-progress': 'En Confection',
        'ready': 'Prête',
        'shipped': 'Expédiée',
        'delivered': 'Livrée'
    };

    const getProgress = (order) => {
        const done = order.craftingSteps.filter(s => s.status === 'completed').length;
        return Math.round((done / order.craftingSteps.length) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm ${
                            toast.type === 'error'
                                ? 'bg-red-500/90 text-white'
                                : 'bg-emerald-500/90 text-white'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            {toast.msg}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 space-y-6 md:space-y-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Suivi des Commandes</h1>
                    <p className="text-stone-500 text-xs md:text-sm tracking-widest uppercase">Order Tracking Management</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="all" className="bg-[#1a1a1a]">All Statuses</option>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key} className="bg-[#1a1a1a]">{label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {[
                    { label: 'Total', value: orders.length },
                    { label: 'Reçues', value: orders.filter(o => o.status === 'received').length },
                    { label: 'En Confection', value: orders.filter(o => o.status === 'in-progress').length },
                    { label: 'Prêtes', value: orders.filter(o => o.status === 'ready').length },
                    { label: 'Livrées', value: orders.filter(o => o.status === 'delivered').length },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (i + 1) }}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                        <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                        <span className="text-2xl font-serif text-white">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-stone-600">
                    <Package className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm">{searchQuery || statusFilter !== 'all' ? 'No orders match your search.' : 'No orders yet.'}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map((order, i) => {
                        const isExpanded = expandedOrder === order._id;
                        const progress = getProgress(order);

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="rounded-2xl bg-[#0F0F0F] border border-white/5 overflow-hidden hover:border-white/10 transition-all"
                            >
                                {/* Order Row */}
                                <div
                                    className="flex items-center gap-4 p-5 cursor-pointer group"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                >
                                    <ChevronRight className={`w-4 h-4 text-stone-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />

                                    {/* Tracking Code */}
                                    <div className="flex items-center gap-2 min-w-[140px]">
                                        <span className="font-mono text-sm font-medium text-white tracking-wider">{order.trackingCode}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCopyCode(order.trackingCode); }}
                                            className="p-1 rounded hover:bg-white/10 transition-colors"
                                            title="Copy code"
                                        >
                                            {copiedCode === order.trackingCode ? (
                                                <Check className="w-3 h-3 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3 h-3 text-stone-500" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Customer */}
                                    <div className="hidden md:flex items-center gap-3 min-w-[150px]">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-white font-serif text-xs">
                                            {order.customerName?.charAt(0) || '?'}
                                        </div>
                                        <span className="text-white text-sm truncate">{order.customerName}</span>
                                    </div>

                                    {/* Product */}
                                    <span className="hidden lg:block text-stone-400 text-sm truncate flex-1">{order.productName}</span>

                                    {/* Progress Bar */}
                                    <div className="hidden md:flex items-center gap-3 min-w-[120px]">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-stone-500 min-w-[28px]">{progress}%</span>
                                    </div>

                                    {/* Status */}
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider border flex-shrink-0 ${getStatusColor(order.status)}`}>
                                        {statusLabels[order.status] || order.status}
                                    </span>

                                    {/* Date */}
                                    <span className="hidden md:block text-stone-600 text-xs min-w-[80px]">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                    </span>

                                    {/* Delete */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order._id); }}
                                        className="p-2 rounded-lg text-stone-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-white/5 p-6">
                                                {/* Order Details Grid */}
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                                                    <div>
                                                        <p className="text-stone-600 text-[10px] uppercase tracking-wider mb-1">Client</p>
                                                        <p className="text-white text-sm">{order.customerName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-stone-600 text-[10px] uppercase tracking-wider mb-1">WhatsApp</p>
                                                        <a href={`https://wa.me/${order.whatsapp}`} className="text-emerald-400 text-sm hover:underline" target="_blank" rel="noreferrer">{order.whatsapp}</a>
                                                    </div>
                                                    {order.email && (
                                                        <div className="col-span-2 md:col-span-1">
                                                            <p className="text-stone-600 text-[10px] uppercase tracking-wider mb-1">Email</p>
                                                            <a href={`mailto:${order.email}`} className="text-emerald-400 text-sm hover:underline break-all">{order.email}</a>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-stone-600 text-[10px] uppercase tracking-wider mb-1">Ville</p>
                                                        <p className="text-white text-sm">{order.city}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-stone-600 text-[10px] uppercase tracking-wider mb-1">Taille</p>
                                                        <p className="text-white text-sm">{order.size}</p>
                                                    </div>
                                                </div>

                                                {/* Order Status Change */}
                                                <div className="flex flex-wrap items-center gap-3 mb-8">
                                                    <span className="text-stone-500 text-xs uppercase tracking-wider">Status:</span>
                                                    {Object.entries(statusLabels).map(([key, label]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => handleUpdateOrderField(order._id, 'status', key)}
                                                            className={`px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider border transition-all ${
                                                                order.status === key
                                                                    ? getStatusColor(key) + ' ring-1 ring-white/10'
                                                                    : 'bg-white/[0.02] text-stone-500 border-white/5 hover:bg-white/5'
                                                            }`}
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Crafting Steps Timeline */}
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-white text-sm font-medium">Crafting Steps</h4>
                                                        <button
                                                            onClick={() => { 
                                                                setShowAddStep(showAddStep === order._id ? null : order._id); 
                                                                setNewStepTitle(''); 
                                                                setNewStepTitleAr('');
                                                                setNewStepDesc(''); 
                                                            }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" /> Add Step
                                                        </button>
                                                    </div>

                                                    {/* Add Step Form */}
                                                    <AnimatePresence>
                                                        {showAddStep === order._id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="mb-4 overflow-hidden"
                                                            >
                                                                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Step title (FR)..."
                                                                            value={newStepTitle}
                                                                            onChange={(e) => setNewStepTitle(e.target.value)}
                                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/20"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Title (AR)..."
                                                                            value={newStepTitleAr}
                                                                            onChange={(e) => setNewStepTitleAr(e.target.value)}
                                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-right placeholder:text-stone-600 focus:outline-none focus:border-white/20"
                                                                            dir="rtl"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Description (optional)..."
                                                                        value={newStepDesc}
                                                                        onChange={(e) => setNewStepDesc(e.target.value)}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-white/20"
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleAddStep(order._id)}
                                                                            disabled={!newStepTitle.trim()}
                                                                            className="px-4 py-2 rounded-lg text-xs font-medium bg-white text-black hover:bg-stone-200 transition-colors disabled:opacity-30"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setShowAddStep(null)}
                                                                            className="px-4 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Steps List */}
                                                    <div className="space-y-2">
                                                        {order.craftingSteps.map((step, stepIndex) => (
                                                            <div
                                                                key={step._id}
                                                                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {/* Step Number */}
                                                                    <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                                                                        <span className="text-stone-600 text-[10px] font-mono w-4 text-right">{stepIndex + 1}</span>
                                                                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStepStatusColor(step.status)}`} />
                                                                    </div>

                                                                    {/* Step Content */}
                                                                    <div className="flex-1 min-w-0">
                                                                        {editingStep === step._id ? (
                                                                            <div className="space-y-2">
                                                                                <div className="grid grid-cols-2 gap-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editStepTitle}
                                                                                        onChange={(e) => setEditStepTitle(e.target.value)}
                                                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/20"
                                                                                        placeholder="Title (FR)"
                                                                                    />
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editStepTitleAr}
                                                                                        onChange={(e) => setEditStepTitleAr(e.target.value)}
                                                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-right focus:outline-none focus:border-white/20"
                                                                                        placeholder="Title (AR)"
                                                                                        dir="rtl"
                                                                                    />
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    value={editStepDesc}
                                                                                    onChange={(e) => setEditStepDesc(e.target.value)}
                                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-white/20"
                                                                                    placeholder="Description"
                                                                                />
                                                                                <div className="flex gap-2">
                                                                                    <button
                                                                                        onClick={() => handleSaveEditStep(order._id, step._id)}
                                                                                        className="px-3 py-1 rounded-lg text-[10px] font-medium bg-white text-black hover:bg-stone-200"
                                                                                    >
                                                                                        <Save className="w-3 h-3" />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setEditingStep(null)}
                                                                                        className="px-3 py-1 rounded-lg text-[10px] font-medium text-stone-400 hover:text-white bg-white/5"
                                                                                    >
                                                                                        <X className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-white text-sm font-medium">{step.title}</p>
                                                                                    {step.titleAr && (
                                                                                        <p className="text-stone-400 text-xs font-serif" dir="rtl">{step.titleAr}</p>
                                                                                    )}
                                                                                </div>
                                                                                {step.description && (
                                                                                    <p className="text-stone-500 text-xs mt-0.5">{step.description}</p>
                                                                                )}
                                                                                {step.completedAt && (
                                                                                    <p className="text-stone-600 text-[10px] mt-1 flex items-center gap-1">
                                                                                        <Clock className="w-3 h-3" />
                                                                                        {new Date(step.completedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                                    </p>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                    {/* Desktop Step Actions (hover reveal) */}
                                                                    {editingStep !== step._id && (
                                                                        <div className="hidden md:flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            {step.status === 'pending' && (
                                                                                <button
                                                                                    onClick={() => handleUpdateStep(order._id, step._id, { status: 'in-progress' })}
                                                                                    disabled={savingStep === step._id}
                                                                                    className="px-2 py-1 rounded-lg text-[9px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors uppercase tracking-wider"
                                                                                >
                                                                                    {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Start'}
                                                                                </button>
                                                                            )}
                                                                            {step.status === 'in-progress' && (
                                                                                <button
                                                                                    onClick={() => handleUpdateStep(order._id, step._id, { status: 'completed' })}
                                                                                    disabled={savingStep === step._id}
                                                                                    className="px-2 py-1 rounded-lg text-[9px] font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors uppercase tracking-wider"
                                                                                >
                                                                                    {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Complete'}
                                                                                </button>
                                                                            )}
                                                                            {step.status === 'completed' && (
                                                                                <button
                                                                                    onClick={() => handleUpdateStep(order._id, step._id, { status: 'pending' })}
                                                                                    disabled={savingStep === step._id}
                                                                                    className="px-2 py-1 rounded-lg text-[9px] font-medium text-stone-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wider"
                                                                                >
                                                                                    {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reset'}
                                                                                </button>
                                                                            )}
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingStep(step._id);
                                                                                    setEditStepTitle(step.title);
                                                                                    setEditStepTitleAr(step.titleAr || '');
                                                                                    setEditStepDesc(step.description || '');
                                                                                }}
                                                                                className="p-1.5 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors"
                                                                            >
                                                                                <Edit3 className="w-3 h-3" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleWhatsAppNotify(order, step)}
                                                                                className="p-1.5 rounded-lg text-green-500 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                                                                                title={stepIndex === 0 ? "Send WhatsApp Confirmation" : `Notify: ${step.title}`}
                                                                            >
                                                                                <MessageCircle className="w-3 h-3" />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => handleEmailNotify(e, order, step)}
                                                                                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                                                                                title={stepIndex === 0 ? "Send Email Confirmation" : `Notify via Email: ${step.title}`}
                                                                            >
                                                                                <Mail className="w-3 h-3" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteStep(order._id, step._id)}
                                                                                className="p-1.5 rounded-lg text-stone-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Mobile Step Actions (always visible) */}
                                                                {editingStep !== step._id && (
                                                                    <div className="flex md:hidden items-center gap-2 mt-3 ml-9 pt-2 border-t border-white/5">
                                                                        {step.status === 'pending' && (
                                                                            <button
                                                                                onClick={() => handleUpdateStep(order._id, step._id, { status: 'in-progress' })}
                                                                                disabled={savingStep === step._id}
                                                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium text-blue-400 bg-blue-500/10 active:bg-blue-500/30 border border-blue-500/20 transition-colors uppercase tracking-wider"
                                                                            >
                                                                                {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Clock className="w-3 h-3" /> Start</>}
                                                                            </button>
                                                                        )}
                                                                        {step.status === 'in-progress' && (
                                                                            <button
                                                                                onClick={() => handleUpdateStep(order._id, step._id, { status: 'completed' })}
                                                                                disabled={savingStep === step._id}
                                                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium text-emerald-400 bg-emerald-500/10 active:bg-emerald-500/30 border border-emerald-500/20 transition-colors uppercase tracking-wider"
                                                                            >
                                                                                {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3" /> Complete</>}
                                                                            </button>
                                                                        )}
                                                                        {step.status === 'completed' && (
                                                                            <button
                                                                                onClick={() => handleUpdateStep(order._id, step._id, { status: 'pending' })}
                                                                                disabled={savingStep === step._id}
                                                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium text-stone-400 bg-white/5 active:bg-white/15 border border-white/10 transition-colors uppercase tracking-wider"
                                                                            >
                                                                                {savingStep === step._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reset'}
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingStep(step._id);
                                                                                setEditStepTitle(step.title);
                                                                                setEditStepTitleAr(step.titleAr || '');
                                                                                setEditStepDesc(step.description || '');
                                                                            }}
                                                                            className="p-2 rounded-lg text-stone-500 active:text-white bg-white/5 active:bg-white/10 transition-colors"
                                                                        >
                                                                            <Edit3 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button
                                                                                    onClick={() => handleWhatsAppNotify(order, step)}
                                                                                    className="p-2 rounded-lg text-green-500 active:text-green-400 bg-white/5 active:bg-green-500/10 transition-colors"
                                                                                    title={stepIndex === 0 ? "Send WhatsApp Confirmation" : `Notify: ${step.title}`}
                                                                                >
                                                                                    <MessageCircle className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={(e) => handleEmailNotify(e, order, step)}
                                                                                    className="p-2 rounded-lg text-blue-400 active:text-blue-300 bg-white/5 active:bg-blue-500/10 transition-colors"
                                                                                    title={stepIndex === 0 ? "Send Email Confirmation" : `Notify via Email: ${step.title}`}
                                                                                >
                                                                                    <Mail className="w-3.5 h-3.5" />
                                                                                </button>
                                                                        <button
                                                                            onClick={() => handleDeleteStep(order._id, step._id)}
                                                                            className="p-2 rounded-lg text-stone-600 active:text-red-400 bg-white/5 active:bg-red-500/10 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* View as customer link */}
                                                <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                                                    <a
                                                        href={`/suivi?code=${order.trackingCode}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View as customer
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default OrdersManagement;
