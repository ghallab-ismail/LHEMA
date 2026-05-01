import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            if (!isVisible) setIsVisible(true);
            cursorX.set(e.clientX - 8);
            cursorY.set(e.clientY - 8);
        };

        const handleMouseOver = (e) => {
            if (
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isVisible]);

    return (
        <>
            {isVisible && (
                <>
                    <style>{`
                        /* Only hide the real cursor when our custom one is active and moving */
                        @media (hover: hover) and (pointer: fine) {
                            body, a, button, .cursor-pointer { 
                                cursor: none !important; 
                            }
                        }
                    `}</style>
                    <motion.div
                        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block h-4 w-4 rounded-full bg-white mix-blend-difference"
                        style={{
                            x: cursorX,
                            y: cursorY,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                            scale: isHovering ? 2.5 : 1,
                            opacity: 1
                        }}
                        transition={{
                            scale: { duration: 0.2, ease: "easeOut" },
                            opacity: { duration: 0.2 }
                        }}
                    />
                </>
            )}
        </>
    );
};

export default CustomCursor;
