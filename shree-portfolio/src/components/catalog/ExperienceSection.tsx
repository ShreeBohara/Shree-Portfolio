'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExperienceCard } from './ExperienceCard';
import { experiences as allExperiences } from '@/data/portfolio';
import { SkeletonGrid } from '@/components/ui/skeleton-card';
import { Briefcase } from 'lucide-react';

export function ExperienceSection() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8">
        {isLoading ? (
          <div className="pl-2">
            <SkeletonGrid count={2} variant="experience" />
          </div>
        ) : allExperiences.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No experience yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Experience information will appear here once added.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Timeline */
          <div className="relative space-y-0 pl-2">
            {/* Timeline line - extends through all cards */}
            <div className="absolute left-[13px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-border/50 via-border/50 to-transparent dashed-line" />

            {allExperiences.map((exp, index) => (
              <ExperienceCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
