"use client";

import { useEffect, useState, useRef } from "react";
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

    // Trail implementation
    const pathRef = useRef<SVGPathElement>(null);
    const pointsRef = useRef<{ x: number; y: number; timestamp: number }[]>([]);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            // Add point to history
            pointsRef.current.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });

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

        // Animation loop for trail
        const animate = () => {
            if (pathRef.current) {
                const now = Date.now();
                // Remove points older than 0.5s
                pointsRef.current = pointsRef.current.filter((p: { timestamp: number }) => now - p.timestamp < 150);

                // Limit max points for performance
                if (pointsRef.current.length > 50) {
                    pointsRef.current = pointsRef.current.slice(-50);
                }

                if (pointsRef.current.length > 1) {
                    // Generate smooth path
                    let d = `M ${pointsRef.current[0].x} ${pointsRef.current[0].y}`;

                    for (let i = 1; i < pointsRef.current.length; i++) {
                        const p = pointsRef.current[i];
                        // Simple line to for now, could be quadratic bezier for more smoothness
                        d += ` L ${p.x} ${p.y}`;
                    }

                    pathRef.current.setAttribute("d", d);
                } else {
                    pathRef.current.setAttribute("d", "");
                }
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
            {/* Trail */}
            <svg className="absolute inset-0 h-full w-full">
                <path
                    ref={pathRef}
                    className="stroke-[var(--accent-color)] opacity-50"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        opacity: isVisible ? 0.6 : 0,
                        transition: "opacity 0.2s ease"
                    }}
                />
            </svg>

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
