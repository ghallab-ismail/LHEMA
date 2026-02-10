import React from 'react';
import { motion } from 'framer-motion';

const Acquisition = () => {
    return (
        <section className="bg-lhema-cream py-32 pb-48 relative overflow-hidden">
            <div className="mx-auto max-w-lg px-6 relative z-10">
                <div className="mb-16 text-center space-y-6">
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-lhema-black/40">
                        Volume 01
                    </p>
                    <h3 className="font-serif text-4xl text-lhema-black md:text-5xl">The Acquisition</h3>
                    <div className="h-px w-12 bg-lhema-gold mx-auto" />
                    <p className="font-serif text-2xl text-lhema-black italic">
                        4,500 MAD
                    </p>
                    <p className="text-xs font-sans tracking-widest text-lhema-black/60 uppercase">
                        3 pieces remaining in Atelier
                    </p>
                </div>

                <form className="space-y-12 bg-white/50 p-12 backdrop-blur-sm border border-lhema-black/5 shadow-2xl">
                    <div className="group relative">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-lhema-black/40 mb-2 block">Full Name</label>
                        <input
                            type="text"
                            className="w-full border-b border-lhema-black/20 bg-transparent py-2 font-serif text-xl text-lhema-black outline-none transition-colors focus:border-lhema-black"
                        />
                    </div>
                    <div className="group relative">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-lhema-black/40 mb-2 block">WhatsApp Number</label>
                        <input
                            type="text"
                            className="w-full border-b border-lhema-black/20 bg-transparent py-2 font-serif text-xl text-lhema-black outline-none transition-colors focus:border-lhema-black"
                        />
                    </div>
                    <div className="group relative">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-lhema-black/40 mb-2 block">City of Residence</label>
                        <input
                            type="text"
                            className="w-full border-b border-lhema-black/20 bg-transparent py-2 font-serif text-xl text-lhema-black outline-none transition-colors focus:border-lhema-black"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative mt-12 w-full overflow-hidden bg-lhema-black px-8 py-5 text-center transition-all hover:bg-lhema-gold"
                    >
                        <span className="relative z-10 font-sans text-xs font-bold uppercase tracking-[0.2em] text-lhema-cream">
                            Request Private Allocation
                        </span>
                    </motion.button>
                </form>

                <p className="mt-8 text-center font-sans text-[10px] uppercase tracking-widest text-lhema-black/30">
                    A Concierge will contact you within 24 hours.
                </p>
            </div>
        </section>
    );
};

export default Acquisition;
