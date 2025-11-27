import { useState, useEffect, useRef } from 'react';

interface UseScrambleTextProps {
    text: string;
    duration?: number;
    tick?: number;
    delay?: number;
    playOnMount?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function useScrambleText({
    text,
    duration = 2000,
    tick = 30,
    delay = 0,
    playOnMount = true,
}: UseScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const play = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const startTime = Date.now();
        const endTime = startTime + duration;

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            if (progress >= 1) {
                setDisplayText(text);
                setIsAnimating(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            const scrambled = text
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    // Reveal characters based on progress
                    if (index / text.length < progress) {
                        return char;
                    }
                    // Show random character
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            setDisplayText(scrambled);
        }, tick);
    };

    useEffect(() => {
        if (playOnMount) {
            timeoutRef.current = setTimeout(play, delay);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, duration, tick, delay, playOnMount]);

    return { displayText, play, isAnimating };
}
