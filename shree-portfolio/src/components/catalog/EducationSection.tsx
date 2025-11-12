'use client';

import { EducationCard } from './EducationCard';
import { education as allEducation } from '@/data/portfolio';
import { motion } from 'framer-motion';

export function EducationSection() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Education Cards */}
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

        {allEducation.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No education information available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
