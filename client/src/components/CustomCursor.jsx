import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            if (!isVisible) setIsVisible(true);
            setMousePosition({ x: e.clientX, y: e.clientY });
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
            <style>{`
                /* Only hide the real cursor if the device has a mouse (fine pointer) AND can hover */
                @media (hover: hover) and (pointer: fine) {
                    body { cursor: none !important; }
                    a, button, .cursor-pointer { cursor: none !important; }
                }
            `}</style>
            {isVisible && (
                <motion.div
                    className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block h-4 w-4 rounded-full bg-white mix-blend-difference"
                    initial={{ opacity: 0 }}
                    animate={{
                        x: mousePosition.x - 8,
                        y: mousePosition.y - 8,
                        scale: isHovering ? 2.5 : 1,
                        opacity: 1
                    }}
                    transition={{
                        x: { duration: 0 },
                        y: { duration: 0 },
                        scale: { duration: 0.2, ease: "easeOut" },
                        opacity: { duration: 0.2 }
                    }}
                />
            )}
        </>
    );
};

export default CustomCursor;
