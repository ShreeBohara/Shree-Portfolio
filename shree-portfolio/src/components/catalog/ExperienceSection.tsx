'use client';

import { ExperienceCard } from './ExperienceCard';
import { experiences as allExperiences } from '@/data/portfolio';

export function ExperienceSection() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8">
        {/* Timeline */}
        <div className="relative space-y-0 pl-2">
          {/* Timeline line - extends through all cards */}
          <div className="absolute left-[13px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-border/50 via-border/50 to-transparent dashed-line" />

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
