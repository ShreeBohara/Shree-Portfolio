'use client';

import { useState, useEffect } from 'react';
import { EducationCard } from './EducationCard';
import { education as allEducation } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { SkeletonGrid } from '@/components/ui/skeleton-card';
import { GraduationCap } from 'lucide-react';

export function EducationSection() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <SkeletonGrid count={2} variant="education" />
        ) : allEducation.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No education yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Education information will appear here once added.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Education Cards */
          <div className="space-y-6">
            {allEducation.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EducationCard education={edu} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
