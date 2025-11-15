'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getCurrentAccentColor } from '@/hooks/useThemeColor';

interface AILoadingAnimationProps {
  minDisplayTime?: number; // Minimum time to display in milliseconds
  onMinTimeReached?: () => void;
}

export function AILoadingAnimation({
  minDisplayTime = 2000,
  onMinTimeReached
}: AILoadingAnimationProps) {
  const [accentColor, setAccentColor] = useState('oklch(0.72 0.12 185)');
  const [hasReachedMinTime, setHasReachedMinTime] = useState(false);

  // Update accent color
  useEffect(() => {
    const color = getCurrentAccentColor();
    if (color) setAccentColor(color);
  }, []);

  // Track minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasReachedMinTime(true);
      onMinTimeReached?.();
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onMinTimeReached]);

  // Number of orbiting particles
  const particleCount = 4;
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div className="w-full py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Main animation container */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: `${accentColor.replace(')', ' / 0.2)')}`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />

            {/* Middle pulsing ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-2"
              style={{
                borderColor: `${accentColor.replace(')', ' / 0.3)')}`,
              }}
              animate={{
                rotate: -360,
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />

            {/* Central glowing orb */}
            <motion.div
              className="absolute w-12 h-12 rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor.replace(')', ' / 0.5)')} 50%, transparent 100%)`,
                boxShadow: `0 0 30px ${accentColor.replace(')', ' / 0.6)')}, 0 0 60px ${accentColor.replace(')', ' / 0.3)')}`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Inner solid core */}
            <motion.div
              className="absolute w-6 h-6 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 20px ${accentColor.replace(')', ' / 0.8)')}, inset 0 0 10px rgba(255, 255, 255, 0.3)`,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Orbiting particles */}
            {particles.map((i) => {
              const angle = (i / particleCount) * 360;
              const delay = (i / particleCount) * 2;

              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor.replace(')', ' / 0.8)')}, 0 0 20px ${accentColor.replace(')', ' / 0.4)')}`,
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * 50,
                      Math.cos(((angle + 90) * Math.PI) / 180) * 50,
                      Math.cos(((angle + 180) * Math.PI) / 180) * 50,
                      Math.cos(((angle + 270) * Math.PI) / 180) * 50,
                      Math.cos((angle * Math.PI) / 180) * 50,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * 50,
                      Math.sin(((angle + 90) * Math.PI) / 180) * 50,
                      Math.sin(((angle + 180) * Math.PI) / 180) * 50,
                      Math.sin(((angle + 270) * Math.PI) / 180) * 50,
                      Math.sin((angle * Math.PI) / 180) * 50,
                    ],
                    scale: [1, 1.5, 1, 1.5, 1],
                    opacity: [0.6, 1, 0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay,
                  }}
                />
              );
            })}

            {/* Particle trails */}
            {particles.map((i) => {
              const angle = (i / particleCount) * 360;
              const delay = (i / particleCount) * 2;

              return (
                <motion.div
                  key={`trail-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    opacity: 0.4,
                  }}
                  animate={{
                    x: [
                      Math.cos((angle * Math.PI) / 180) * 50,
                      Math.cos(((angle + 90) * Math.PI) / 180) * 50,
                      Math.cos(((angle + 180) * Math.PI) / 180) * 50,
                      Math.cos(((angle + 270) * Math.PI) / 180) * 50,
                      Math.cos((angle * Math.PI) / 180) * 50,
                    ],
                    y: [
                      Math.sin((angle * Math.PI) / 180) * 50,
                      Math.sin(((angle + 90) * Math.PI) / 180) * 50,
                      Math.sin(((angle + 180) * Math.PI) / 180) * 50,
                      Math.sin(((angle + 270) * Math.PI) / 180) * 50,
                      Math.sin((angle * Math.PI) / 180) * 50,
                    ],
                    scale: [0.5, 1, 0.5, 1, 0.5],
                    opacity: [0.2, 0.6, 0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: delay + 0.2,
                  }}
                />
              );
            })}

            {/* Connection lines to particles */}
            {particles.map((i) => {
              const angle = (i / particleCount) * 360;
              const delay = (i / particleCount) * 2;
              const length = 50;

              return (
                <motion.div
                  key={`line-${i}`}
                  className="absolute origin-center"
                  style={{
                    width: '2px',
                    height: `${length}px`,
                    background: `linear-gradient(to bottom, ${accentColor} 0%, transparent 100%)`,
                    transformOrigin: 'top center',
                    opacity: 0.3,
                  }}
                  animate={{
                    rotate: [angle, angle + 90, angle + 180, angle + 270, angle + 360],
                    scaleY: [1, 0.8, 1, 0.8, 1],
                    opacity: [0.2, 0.5, 0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay,
                  }}
                />
              );
            })}

            {/* Outer glow pulse */}
            <motion.div
              className="absolute inset-[-20px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor.replace(')', ' / 0.1)')} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Animated text */}
          <div className="flex items-center gap-2">
            <motion.span
              className="text-base font-medium"
              style={{ color: accentColor }}
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Thinking
            </motion.span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <motion.div
            className="w-48 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: `${accentColor.replace(')', ' / 0.1)')}` }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
