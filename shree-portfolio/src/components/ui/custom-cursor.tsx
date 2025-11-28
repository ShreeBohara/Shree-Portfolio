"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Check if hovering over interactive elements
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest("a") ||
                target.closest("button") ||
                target.closest('[role="button"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsHovering(!!isInteractive);
            setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    // Hide on mobile
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
        return null;
    }

    const pathname = usePathname();
    const isArchive = pathname?.startsWith("/archive");

    useEffect(() => {
        if (isArchive) {
            document.body.classList.remove("custom-cursor-active");
        } else {
            document.body.classList.add("custom-cursor-active");
        }
        return () => {
            document.body.classList.remove("custom-cursor-active");
        };
    }, [isArchive]);

    if (isArchive) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main Dot */}
            <motion.div
                className="absolute h-2.5 w-2.5 rounded-full bg-primary mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Trailing Ring */}
            <motion.div
                className="absolute rounded-full border border-primary/50 mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    height: isHovering ? 60 : 20,
                    width: isHovering ? 60 : 20,
                    backgroundColor: isHovering ? "rgba(var(--primary), 0.1)" : "transparent",
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 400,
                    mass: 0.5
                }}
            />
        </div>
    );
}
