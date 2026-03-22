import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Search,
    Filter,
    MoreHorizontal,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    X,
    MessageCircle,
    Menu,
    LogOut,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Package,
    Tag,
    ImageOff,
    Truck
} from 'lucide-react';
import OrdersManagement from '../components/OrdersManagement';
import InquiryModal from '../components/InquiryModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import ProductModal from '../components/ProductModal';

const AdminDashboard = () => {
    // Section toggle
    const [activeSection, setActiveSection] = useState('inquiries'); // 'inquiries' | 'products' | 'orders'

    // Inquiries state
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Inquiry CRUD Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [inquiryToDelete, setInquiryToDelete] = useState(null);

    // Bulk Actions State
    const [selectedInquiries, setSelectedInquiries] = useState([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    // Products state
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productModalMode, setProductModalMode] = useState('create');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');

    const navigate = useNavigate();

    // Filtered inquiries based on search + status filter
    const filteredInquiries = useMemo(() => {
        return inquiries.filter((inq) => {
            if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    inq.name?.toLowerCase().includes(q) ||
                    inq.whatsapp?.toLowerCase().includes(q) ||
                    inq.productName?.toLowerCase().includes(q) ||
                    inq.city?.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [inquiries, searchQuery, statusFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / rowsPerPage));
    const paginatedInquiries = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredInquiries.slice(start, start + rowsPerPage);
    }, [filteredInquiries, currentPage, rowsPerPage]);

    // Reset to page 1 when search/filter/rowsPerPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, rowsPerPage]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/portal-lhema-access/login');
    };

    useEffect(() => {
        fetchInquiries();
        fetchProducts();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => { setActiveMenu(null); setShowFilterMenu(false); };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Helper: if any API call returns 401, clear token and redirect to login
    const handleUnauthorized = (response) => {
        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            navigate('/portal-lhema-access/login');
            return true;
        }
        return false;
    };

    const fetchInquiries = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
                headers: { 'x-auth-token': token }
            });
            if (handleUnauthorized(response)) return;
            const data = await response.json();
            setInquiries(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    const handleCreateProduct = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                await fetchProducts();
                setIsProductModalOpen(false);
            }
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const handleUpdateProduct = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                await fetchProducts();
                setIsProductModalOpen(false);
            }
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productToDelete._id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
                setIsProductDeleteModalOpen(false);
                setProductToDelete(null);
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const openCreateProductModal = () => {
        setProductModalMode('create');
        setSelectedProduct(null);
        setIsProductModalOpen(true);
    };

    const openEditProductModal = (product) => {
        setProductModalMode('edit');
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const filteredProducts = useMemo(() => {
        if (productCategoryFilter === 'all') return products;
        return products.filter(p => p.category === productCategoryFilter);
    }, [products, productCategoryFilter]);

    const handleStatusUpdate = async (e, id, newStatus) => {
        e.stopPropagation(); // Prevent menu from closing immediately
        try {
            // Optimistic update
            setInquiries(prev => prev.map(inq =>
                inq._id === id ? { ...inq, status: newStatus } : inq
            ));
            setActiveMenu(null);

            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
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

    const handleBulkStatusUpdate = async (newStatus) => {
        if (selectedInquiries.length === 0) return;
        try {
            // Optimistic update
            setInquiries(prev => prev.map(inq =>
                selectedInquiries.includes(inq._id) ? { ...inq, status: newStatus } : inq
            ));

            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/bulk-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ ids: selectedInquiries, status: newStatus }),
            });

            if (response.ok) {
                setSelectedInquiries([]);
            } else {
                fetchInquiries();
            }
        } catch (error) {
            console.error('Error updating bulk status:', error);
            fetchInquiries();
        }
    };

    const handleCreateInquiry = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchInquiries();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Error creating inquiry:', err);
        }
    };

    const handleUpdateInquiry = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/${selectedInquiry._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchInquiries();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Error updating inquiry:', err);
        }
    };

    const handleDeleteInquiry = async () => {
        if (!inquiryToDelete) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/${inquiryToDelete._id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                setInquiries(prev => prev.filter(inq => inq._id !== inquiryToDelete._id));
                setIsDeleteModalOpen(false);
                setInquiryToDelete(null);
                setSelectedInquiries(prev => prev.filter(id => id !== inquiryToDelete._id));
            }
        } catch (err) {
            console.error('Error deleting inquiry:', err);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedInquiries.length === 0) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries/bulk-delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ ids: selectedInquiries })
            });

            if (response.ok) {
                setInquiries(prev => prev.filter(inq => !selectedInquiries.includes(inq._id)));
                setSelectedInquiries([]);
                setIsBulkDeleteModalOpen(false);
            }
        } catch (err) {
            console.error('Error bulk deleting inquiries:', err);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const ids = paginatedInquiries.map(inq => inq._id);
            // Add new ids to existing selection without duplicates
            setSelectedInquiries(prev => [...new Set([...prev, ...ids])]);
        } else {
            const ids = paginatedInquiries.map(inq => inq._id);
            // Remove visible ids from selection
            setSelectedInquiries(prev => prev.filter(id => !ids.includes(id)));
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedInquiries(prev => [...prev, id]);
        } else {
            setSelectedInquiries(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const isAllVisibleSelected = paginatedInquiries.length > 0 && paginatedInquiries.every(inq => selectedInquiries.includes(inq._id));

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedInquiry(null);
        setIsModalOpen(true);
    };

    const openEditModal = (inquiry) => {
        setModalMode('edit');
        setSelectedInquiry(inquiry);
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const openDeleteModal = (inquiry) => {
        setInquiryToDelete(inquiry);
        setIsDeleteModalOpen(true);
        setActiveMenu(null);
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
            case 'no answer': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'wrong number': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-stone-500/10 text-stone-500 border-stone-500/20';
        }
    };

    // StatusMenu was removed here to be inlined below to prevent React identity re-render crashes

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 font-sans selection:bg-white/20">
            {/* Sidebar / Navigation (Desktop) */}
            <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 border-r border-white/5 flex-col items-center py-8 z-50 bg-[#0a0a0a]">
                <div className="mb-12">
                    <div className="w-8 h-8 bg-white rounded-full opacity-90" />
                </div>
                <div className="space-y-4">
                    <button
                        onClick={() => setActiveSection('inquiries')}
                        title="Requests"
                        className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            activeSection === 'inquiries' ? 'bg-white/10 text-white' : 'text-stone-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setActiveSection('products')}
                        title="Products"
                        className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            activeSection === 'products' ? 'bg-white/10 text-white' : 'text-stone-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Package className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setActiveSection('orders')}
                        title="Orders"
                        className={`p-3 rounded-xl transition-all hover:scale-105 ${
                            activeSection === 'orders' ? 'bg-white/10 text-white' : 'text-stone-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Truck className="w-5 h-5" />
                    </button>
                </div>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="p-3 rounded-xl text-stone-500 hover:bg-red-500/10 hover:text-red-400 transition-all hover:scale-105"
                        title="Déconnexion"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white rounded-full opacity-90" />
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveSection('inquiries')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                activeSection === 'inquiries' ? 'bg-white/10 text-white' : 'text-stone-500'
                            }`}
                        >
                            Requests
                        </button>
                        <button
                            onClick={() => setActiveSection('products')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                activeSection === 'products' ? 'bg-white/10 text-white' : 'text-stone-500'
                            }`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveSection('orders')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                activeSection === 'orders' ? 'bg-white/10 text-white' : 'text-stone-500'
                            }`}
                        >
                            Orders
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-stone-500 hover:text-red-400 transition-colors"
                    title="Déconnexion"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="md:pl-20">
                <div className="max-w-7xl mx-auto p-6 md:p-12">
                {/* ======================== PRODUCTS SECTION ======================== */}
                {activeSection === 'products' && (
                    <motion.div
                        key="products"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Products Header */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 space-y-6 md:space-y-0">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">Collection</h1>
                                <p className="text-stone-500 text-xs md:text-sm tracking-widest uppercase">Product Management</p>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                {/* Category Filter */}
                                <div className="flex gap-2">
                                    {['all', 'femme', 'homme'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setProductCategoryFilter(cat)}
                                            className={`px-4 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
                                                productCategoryFilter === cat
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/5 text-stone-400 border border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            {cat === 'all' ? 'All' : cat === 'femme' ? '♀ Femme' : '♂ Homme'}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={openCreateProductModal}
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:bg-stone-200 transition-colors whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" /> Add Product
                                </button>
                            </div>
                        </div>

                        {/* Products Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { label: 'Total', value: products.length },
                                { label: 'Femme', value: products.filter(p => p.category === 'femme').length },
                                { label: 'Homme', value: products.filter(p => p.category === 'homme').length },
                                { label: 'Available', value: products.filter(p => p.isAvailable).length },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (i + 1) }}
                                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                                >
                                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                                    <span className="text-3xl font-serif text-white">{stat.value}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Products Grid */}
                        {productsLoading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-stone-600">
                                <Package className="w-12 h-12 mb-4 opacity-30" />
                                <p className="text-sm">No products yet. Add your first one.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product, i) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        className="group relative bg-[#0F0F0F] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
                                    >
                                        {/* Image */}
                                        <div className="aspect-[3/4] bg-stone-900 relative overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full ${product.images && product.images.length > 0 ? 'hidden' : 'flex'} items-center justify-center text-stone-700 absolute inset-0 bg-stone-900`}>
                                                <ImageOff className="w-10 h-10" />
                                            </div>
                                            {/* Category badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                                    product.category === 'femme'
                                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/20'
                                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                                                }`}>
                                                    {product.category}
                                                </span>
                                            </div>
                                            {/* Availability badge */}
                                            {!product.isAvailable && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-stone-800 text-stone-400 border border-stone-700">
                                                        Sold Out
                                                    </span>
                                                </div>
                                            )}
                                            {/* Image count */}
                                            {product.images && product.images.length > 1 && (
                                                <div className="absolute bottom-3 right-3">
                                                    <span className="px-2 py-1 rounded-lg text-[10px] bg-black/60 text-stone-300 backdrop-blur-sm">
                                                        +{product.images.length - 1}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card body */}
                                        <div className="p-4">
                                            <h3 className="text-white font-serif text-base mb-1 truncate">{product.name}</h3>
                                            <p className="text-stone-400 text-sm font-medium">{product.price.toLocaleString()} MAD</p>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {product.sizes.slice(0, 4).map(size => (
                                                        <span key={size} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-stone-500 border border-white/5">{size}</span>
                                                    ))}
                                                    {product.sizes.length > 4 && (
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] text-stone-600">+{product.sizes.length - 4}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="border-t border-white/5 flex">
                                            <button
                                                onClick={() => openEditProductModal(product)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 text-stone-500 hover:text-white hover:bg-white/5 transition-colors text-xs uppercase tracking-wider"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <div className="w-px bg-white/5" />
                                            <button
                                                onClick={() => { setProductToDelete(product); setIsProductDeleteModalOpen(true); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 text-stone-500 hover:text-red-400 hover:bg-red-500/5 transition-colors text-xs uppercase tracking-wider"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
                {/* ======================== END PRODUCTS SECTION ======================== */}

                {/* ======================== ORDERS SECTION ======================== */}
                {activeSection === 'orders' && <OrdersManagement />}
                {/* ======================== END ORDERS SECTION ======================== */}

                {/* ======================== INQUIRIES SECTION ======================== */}
                {activeSection === 'inquiries' && (<>
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="relative w-full md:w-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); }}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors w-full md:w-auto ${statusFilter !== 'all'
                                        ? 'bg-white text-black hover:bg-stone-200'
                                        : 'bg-white/5 text-stone-300 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    {statusFilter === 'all' ? 'Filter' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {showFilterMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {['all', 'pending', 'contacted', 'no answer', 'wrong number', 'completed', 'cancelled'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                                                    className={`w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/5 transition-colors flex items-center gap-3
                                                        ${statusFilter === status ? 'text-white bg-white/5' : 'text-stone-400'}
                                                    `}
                                                >
                                                    {status !== 'all' && (
                                                        <span className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-amber-500' :
                                                            status === 'contacted' ? 'bg-blue-500' :
                                                                status === 'no answer' ? 'bg-orange-400' :
                                                                    status === 'wrong number' ? 'bg-violet-400' :
                                                                        status === 'completed' ? 'bg-emerald-500' :
                                                                            'bg-red-500'
                                                            }`} />
                                                    )}
                                                    {status === 'all' ? 'All Statuses' : status}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-white text-black hover:bg-stone-200 transition-colors w-full md:w-auto whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" /> New Request
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

                    {/* Bulk Actions Toolbar */}
                    <AnimatePresence>
                        {selectedInquiries.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-3 md:p-4 flex items-center justify-between w-[calc(100%-2rem)] md:w-auto md:min-w-[400px] max-w-lg transition-all"
                            >
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black text-xs font-bold">
                                        {selectedInquiries.length}
                                    </span>
                                    <span className="text-xs md:text-sm font-medium text-white hidden sm:block">Selected</span>
                                </div>

                                <div className="h-8 w-[1px] bg-white/10 mx-2 md:mx-4 hidden sm:block shrink-0" />

                                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                    <div className="relative group">
                                        <button className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-stone-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors whitespace-nowrap">
                                            Status <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70" />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block pb-2">
                                            {['pending', 'contacted', 'no answer', 'wrong number', 'completed', 'cancelled'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleBulkStatusUpdate(status)}
                                                    className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/5 transition-colors text-stone-300"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsBulkDeleteModalOpen(true)}
                                        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors whitespace-nowrap"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Delete</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedInquiries([])}
                                        className="p-2 md:ml-1 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors shrink-0"
                                        title="Clear Selection"
                                    >
                                        <X className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                        <th className="py-6 pl-8 pr-4">
                                            <input
                                                type="checkbox"
                                                checked={isAllVisibleSelected}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 rounded border-white/20 bg-transparent text-white focus:ring-0 focus:ring-offset-0 accent-white cursor-pointer"
                                            />
                                        </th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Client</th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Product</th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Size</th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Location</th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left py-6 px-4 text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                        <th className="py-6 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedInquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-16 text-center text-stone-500 text-sm">
                                                {searchQuery || statusFilter !== 'all' ? 'No requests match your search or filter.' : 'No requests yet.'}
                                            </td>
                                        </tr>
                                    ) : paginatedInquiries.map((inquiry, i) => (
                                        <motion.tr
                                            key={inquiry._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + (i * 0.05) }}
                                            className={`group transition-colors ${selectedInquiries.includes(inquiry._id) ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            <td className="py-6 pl-8 pr-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInquiries.includes(inquiry._id)}
                                                    onChange={(e) => handleSelectOne(e, inquiry._id)}
                                                    className="w-4 h-4 rounded border-white/20 bg-transparent text-white focus:ring-0 focus:ring-offset-0 accent-white cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-white font-serif">
                                                        {inquiry?.name ? inquiry.name.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{inquiry?.name || 'Unknown'}</p>
                                                        <p className="text-stone-500 text-xs mt-1 flex items-center gap-2">
                                                            <MessageCircle className="w-3 h-3" />
                                                            {inquiry?.whatsapp || 'No status'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="text-stone-300">{inquiry?.productName || 'Unknown'}</span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-stone-300 border border-white/10">
                                                    {inquiry?.size || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="text-stone-400">{inquiry?.city || 'Unknown'}</span>
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
                                            <td className="py-6 px-4 text-right relative">
                                                <button
                                                    onClick={(e) => toggleMenu(e, inquiry._id)}
                                                    className="text-stone-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <AnimatePresence>
                                                    {activeMenu === inquiry._id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {['pending', 'contacted', 'no answer', 'wrong number', 'completed', 'cancelled'].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={(e) => handleStatusUpdate(e, inquiry._id, status)}
                                                                    className={`w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/5 transition-colors
                                                                        ${inquiry.status === status ? 'text-white bg-white/5' : 'text-stone-400'}
                                                                    `}
                                                                >
                                                                    {status}
                                                                </button>
                                                            ))}
                                                            <div className="border-t border-white/5 my-1" />
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); openEditModal(inquiries.find(i => i._id === inquiry._id)); }}
                                                                className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-stone-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                                            >
                                                                <Edit2 className="w-3 h-3" /> Edit Details
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); openDeleteModal(inquiries.find(i => i._id === inquiry._id)); }}
                                                                className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-3 h-3" /> Delete
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Pagination Controls (Desktop) */}
                    {filteredInquiries.length > 0 && (
                        <div className="hidden md:flex items-center justify-between mt-6 px-2">
                            <div className="flex items-center gap-3">
                                <span className="text-stone-500 text-xs">Rows per page:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 cursor-pointer appearance-none"
                                    style={{ backgroundImage: 'none' }}
                                >
                                    {[5, 10, 25, 50].map(n => (
                                        <option key={n} value={n} className="bg-[#1a1a1a] text-white">{n}</option>
                                    ))}
                                </select>
                                <span className="text-stone-600 text-xs">
                                    {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredInquiries.length)} of {filteredInquiries.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                                    .reduce((acc, page, idx, arr) => {
                                        if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...');
                                        acc.push(page);
                                        return acc;
                                    }, [])
                                    .map((page, idx) =>
                                        page === '...' ? (
                                            <span key={`dots-${idx}`} className="px-2 text-stone-600 text-xs">…</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page
                                                    ? 'bg-white text-black'
                                                    : 'text-stone-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )
                                }
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {paginatedInquiries.length === 0 ? (
                            <div className="text-center py-12 text-stone-500 text-sm">
                                {searchQuery || statusFilter !== 'all' ? 'No requests match your search or filter.' : 'No requests yet.'}
                            </div>
                        ) : paginatedInquiries.map((inquiry, i) => (
                            <motion.div
                                key={inquiry._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className={`border p-5 rounded-2xl ${selectedInquiries.includes(inquiry._id) ? 'bg-white/[0.05] border-white/20' : 'bg-[#0F0F0F] border-white/5'}`}
                            >
                                <div className="flex justify-between items-start mb-4 relative">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedInquiries.includes(inquiry._id)}
                                            onChange={(e) => handleSelectOne(e, inquiry._id)}
                                            className="w-5 h-5 mr-1 rounded border-white/20 bg-transparent text-white focus:ring-0 focus:ring-offset-0 accent-white cursor-pointer"
                                        />
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-white font-serif">
                                            {inquiry?.name ? inquiry.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{inquiry?.name || 'Unknown'}</p>
                                            <p className="text-stone-500 text-xs flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                {inquiry?.whatsapp || 'No status'}
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
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 mt-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {['pending', 'contacted', 'no answer', 'wrong number', 'completed', 'cancelled'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={(e) => handleStatusUpdate(e, inquiry._id, status)}
                                                            className={`w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/5 transition-colors
                                                                ${inquiry.status === status ? 'text-white bg-white/5' : 'text-stone-400'}
                                                            `}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                    <div className="border-t border-white/5 my-1" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditModal(inquiries.find(i => i._id === inquiry._id)); }}
                                                        className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-stone-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                                    >
                                                        <Edit2 className="w-3 h-3" /> Edit Details
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openDeleteModal(inquiries.find(i => i._id === inquiry._id)); }}
                                                        className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Product</span>
                                        <span className="text-stone-300 text-right">{inquiry?.productName || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Size</span>
                                        <span className="text-stone-300">{inquiry?.size || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Location</span>
                                        <span className="text-stone-300">{inquiry?.city || 'Unknown'}</span>
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

                    {/* Pagination Controls (Mobile) */}
                    {filteredInquiries.length > 0 && (
                        <div className="md:hidden flex flex-col gap-4 mt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-stone-500 text-xs">Show:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                                    >
                                        {[5, 10, 25, 50].map(n => (
                                            <option key={n} value={n} className="bg-[#1a1a1a] text-white">{n}</option>
                                        ))}
                                    </select>
                                </div>
                                <span className="text-stone-600 text-xs">
                                    {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredInquiries.length)} of {filteredInquiries.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-stone-300 min-w-[80px] text-center">
                                    Page {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>)}
                {/* ======================== END INQUIRIES SECTION ======================== */}
                </div>
            </main>

            <InquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={selectedInquiry}
                onSubmit={modalMode === 'create' ? handleCreateInquiry : handleUpdateInquiry}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteInquiry}
                clientName={inquiryToDelete?.name}
            />

            <ConfirmDeleteModal
                isOpen={isBulkDeleteModalOpen}
                onClose={() => setIsBulkDeleteModalOpen(false)}
                onConfirm={handleBulkDelete}
                clientName={`${selectedInquiries.length} selected requests`}
            />

            {/* Product Modals */}
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                mode={productModalMode}
                initialData={selectedProduct}
                onSubmit={productModalMode === 'create' ? handleCreateProduct : handleUpdateProduct}
            />

            <ConfirmDeleteModal
                isOpen={isProductDeleteModalOpen}
                onClose={() => setIsProductDeleteModalOpen(false)}
                onConfirm={handleDeleteProduct}
                clientName={productToDelete?.name}
            />

        </div>
    );
};

export default AdminDashboard;
