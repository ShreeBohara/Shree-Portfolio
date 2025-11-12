'use client';

import { ExperienceCard } from './ExperienceCard';
import { experiences as allExperiences } from '@/data/portfolio';
import { motion } from 'framer-motion';

export function ExperienceSection() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Timeline */}
        <div className="relative space-y-0">
          {/* Timeline line - extends through all cards */}
          <div className="absolute left-[5px] top-8 bottom-0 w-0.5 bg-border" />
          
          {allExperiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>

        {allExperiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No experience information available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
