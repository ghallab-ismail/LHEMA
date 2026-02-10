import React from 'react';
import { motion } from 'framer-motion';

const ThreadReveal = () => {
    return (
        <section className="relative flex h-screen w-full items-center justify-center bg-lhema-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Abstract Wave Background */}
                <svg className="h-full w-full opacity-20" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M-100 450 Q 360 200 720 450 T 1540 450"
                        stroke="#C2B280"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M-100 650 Q 360 400 720 650 T 1540 650"
                        stroke="#C2B280"
                        strokeWidth="1"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
                    />
                </svg>
            </div>

            <div className="relative z-10 text-center mix-blend-difference">
                <motion.h2
                    className="font-serif text-6xl text-lhema-cream md:text-9xl tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                >
                    TIMLESS
                </motion.h2>
                <motion.div
                    className="mt-8 h-px w-0 bg-lhema-gold mx-auto"
                    whileInView={{ width: "20rem" }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                />
                <motion.p
                    className="mt-6 font-sans text-xs uppercase tracking-[0.4em] text-lhema-cream/60"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                >
                    The Thread of History
                </motion.p>
            </div>
        </section>
    );
};

export default ThreadReveal;
