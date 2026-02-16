import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Server error');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-serif text-2xl text-white mb-2">Maison Lhema</h1>
                    <p className="text-stone-500 text-xs tracking-widest uppercase">Conciergerie Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez le code d'accès"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-center text-white placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors font-serif tracking-widest"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-xs text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors"
                    >
                        Entrer
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
