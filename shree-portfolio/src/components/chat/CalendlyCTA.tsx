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
        className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors mt-2"
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
      className="mt-4 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {message}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Book a 30-minute call with Shree to dive deeper into his work, discuss opportunities, or just chat about tech!
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
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
