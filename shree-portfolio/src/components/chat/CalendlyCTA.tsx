'use client';

import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendlyCTAProps {
  message?: string;
  compact?: boolean;
}

export function CalendlyCTA({
  message = "Want to discuss this further?",
  compact = false
}: CalendlyCTAProps) {
  const calendlyUrl = "https://calendly.com/shreetbohara/connect-with-shree";

  const handleClick = () => {
    window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleClick}
        className="inline-flex items-center gap-2 text-sm text-accent-color underline underline-offset-2 hover:text-accent-color/80 transition-colors mt-2 font-medium"
      >
        <Calendar className="w-4 h-4" />
        <span>Schedule a call with Shree</span>
        <ArrowRight className="w-3 h-3" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-4 p-4 rounded-lg border bg-muted/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Calendar className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {message}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Book a 30-minute call with Shree to dive deeper into his work, discuss opportunities, or just chat about tech!
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-color hover:bg-accent-color/90 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule a Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
