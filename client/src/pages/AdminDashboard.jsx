import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    MessageCircle,
    Menu
} from 'lucide-react';

const AdminDashboard = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/inquiries');
            const data = await response.json();
            setInquiries(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e, id, newStatus) => {
        e.stopPropagation(); // Prevent menu from closing immediately
        try {
            // Optimistic update
            setInquiries(prev => prev.map(inq =>
                inq._id === id ? { ...inq, status: newStatus } : inq
            ));
            setActiveMenu(null);

            const response = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                // Revert on error
                fetchInquiries();
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            fetchInquiries();
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === id ? null : id);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'contacted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-stone-500/10 text-stone-500 border-stone-500/20';
        }
    };

    const StatusMenu = ({ id, currentStatus }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {['pending', 'contacted', 'completed', 'cancelled'].map((status) => (
                <button
                    key={status}
                    onClick={(e) => handleStatusUpdate(e, id, status)}
                    className={`w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/5 transition-colors
                        ${currentStatus === status ? 'text-white bg-white/5' : 'text-stone-400'}
                    `}
                >
                    {status}
                </button>
            ))}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 font-sans selection:bg-white/20">
            {/* Sidebar / Navigation (Desktop) */}
            <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 border-r border-white/5 flex-col items-center py-8 z-50 bg-[#0a0a0a]">
                <div className="mb-12">
                    <div className="w-8 h-8 bg-white rounded-full opacity-90" />
                </div>
                <div className="space-y-8">
                    <button className="p-3 rounded-xl bg-white/5 text-white transition-all hover:scale-105">
                        <LayoutDashboard className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-40">
                <div className="w-8 h-8 bg-white rounded-full opacity-90" />
                <button className="p-2 text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content */}
            <main className="md:pl-20">
                <div className="max-w-7xl mx-auto p-6 md:p-12">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 space-y-6 md:space-y-0">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-4xl font-serif text-white mb-2"
                            >
                                Conciergerie Request
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-stone-500 text-xs md:text-sm tracking-widest uppercase"
                            >
                                Overview & Management
                            </motion.p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                <input
                                    type="text"
                                    placeholder="Search request..."
                                    className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                />
                            </div>
                            <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-stone-200 transition-colors w-full md:w-auto">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                        {[
                            { label: 'Total Requests', value: inquiries.length, change: '+12%' },
                            { label: 'Pending', value: inquiries.filter(i => i.status === 'pending').length, change: '-5%' },
                            { label: 'Conversion Rate', value: '68%', change: '+2.4%' },
                            { label: 'Avg. Response', value: '2h', change: '-15m' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * (i + 1) }}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                            >
                                <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-serif text-white">{stat.value}</span>
                                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                                        <ArrowUpRight className="w-3 h-3" />
                                        {stat.change}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="hidden md:block rounded-3xl bg-[#0F0F0F] border border-white/5 overflow-visible"
                    >
                        <div className="overflow-visible">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Client</th>
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Product</th>
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Size</th>
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Location</th>
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-6 px-8 text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                        <th className="py-6 px-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {inquiries.map((inquiry, i) => (
                                        <motion.tr
                                            key={inquiry._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + (i * 0.05) }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-white font-serif">
                                                        {inquiry.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{inquiry.name}</p>
                                                        <p className="text-stone-500 text-xs mt-1 flex items-center gap-2">
                                                            <MessageCircle className="w-3 h-3" />
                                                            {inquiry.whatsapp}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="text-stone-300">{inquiry.productName}</span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-stone-300 border border-white/10">
                                                    {inquiry.size}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="text-stone-400">{inquiry.city}</span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                                                    {inquiry.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-2 text-stone-500 text-xs">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right relative">
                                                <button
                                                    onClick={(e) => toggleMenu(e, inquiry._id)}
                                                    className="text-stone-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <AnimatePresence>
                                                    {activeMenu === inquiry._id && (
                                                        <StatusMenu id={inquiry._id} currentStatus={inquiry.status} />
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {inquiries.map((inquiry, i) => (
                            <motion.div
                                key={inquiry._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-[#0F0F0F] border border-white/5 p-5 rounded-2xl"
                            >
                                <div className="flex justify-between items-start mb-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-white font-serif">
                                            {inquiry.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{inquiry.name}</p>
                                            <p className="text-stone-500 text-xs flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {inquiry.whatsapp}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={(e) => toggleMenu(e, inquiry._id)}
                                            className="text-stone-500 hover:text-white p-2"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        <AnimatePresence>
                                            {activeMenu === inquiry._id && (
                                                <StatusMenu id={inquiry._id} currentStatus={inquiry.status} />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Product</span>
                                        <span className="text-stone-300 text-right">{inquiry.productName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Size</span>
                                        <span className="text-stone-300">{inquiry.size}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Location</span>
                                        <span className="text-stone-300">{inquiry.city}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center pt-2 border-t border-white/5 mt-3">
                                        <div className="flex items-center gap-2 text-stone-500 text-xs">
                                            <Clock className="w-3 h-3" />
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(inquiry.status)}`}>
                                            {inquiry.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
